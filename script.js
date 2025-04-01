// Elenco delle categorie che vogliamo leggere dal file Excel
const CATEGORIES = ["Antipasti", "Pizze", "Panini", "Bibite", "Dolci"];

// Funzione per creare l'HTML di un singolo prodotto
function createMenuItemHTML(nome, descrizione, prezzo) {
  return `
    <div class="menu-item">
      <h4>${nome}</h4>
      <p>${descrizione}</p>
      <p class="price">€ ${prezzo}</p>
    </div>
  `;
}

// Funzione per caricare il file Excel
function loadExcelFile() {
  // Prova a fare la fetch del file "prodotti.xlsx" nella stessa cartella
  fetch('prodotti.xlsx')
    .then(response => {
      if (!response.ok) {
        throw new Error("File non trovato");
      }
      return response.arrayBuffer();
    })
    .then(data => {
      const workbook = XLSX.read(data, { type: 'array' });

      // Per ogni categoria, andiamo a leggere il relativo foglio
      CATEGORIES.forEach(cat => {
        const containerId = cat.toLowerCase() + '-container';
        const container = document.getElementById(containerId);

        // Verifichiamo se la categoria esiste come nome di foglio
        if (workbook.SheetNames.includes(cat)) {
          const worksheet = workbook.Sheets[cat];
          // Converte il foglio in array di oggetti (usando la prima riga come header)
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // jsonData è un array di righe; ci aspettiamo come intestazione:
          // [ Nome, Descrizione, Prezzo ]
          // Saltiamo la prima riga (intestazioni)
          if (jsonData.length > 1) {
            // Rimuoviamo la prima riga (header)
            jsonData.shift();

            // Creiamo la lista HTML
            let htmlItems = '';
            jsonData.forEach(row => {
              // row dovrebbe contenere [nome, descrizione, prezzo]
              const nome = row[0] || "N/A";
              const descrizione = row[1] || "";
              const prezzo = row[2] || "0.00";
              htmlItems += createMenuItemHTML(nome, descrizione, prezzo);
            });
            container.innerHTML = htmlItems;
          } else {
            // Significa che non ci sono prodotti
            container.innerHTML = `<div class="empty-category">Non sono presenti prodotti in questa categoria</div>`;
          }
        } else {
          // Foglio non trovato: anche qui, nessun prodotto
          container.innerHTML = `<div class="empty-category">Non sono presenti prodotti in questa categoria</div>`;
        }
      });
    })
    .catch(err => {
      // Se non è stato trovato il file o c'è un errore, mostriamo l'avviso in tutte le categorie
      CATEGORIES.forEach(cat => {
        const containerId = cat.toLowerCase() + '-container';
        document.getElementById(containerId).innerHTML = `
          <div class="empty-category">file dei prodotti non trovato</div>
        `;
      });
    });
}

// Avviamo il caricamento all'apertura della pagina
window.addEventListener('DOMContentLoaded', loadExcelFile);
