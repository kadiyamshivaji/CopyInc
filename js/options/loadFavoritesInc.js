let favoritesIncs = []
const loadFavoritesIncs = async () => {
  const tableBody = document.querySelector("#data-table-favorites tbody")
  tableBody.innerHTML = ""

  try {
    const { favorites = [] } = await chrome.storage.sync.get("favorites")
    favoritesIncs = favorites
    favoritesIncs.forEach((row, index) => {
      const newRow = document.createElement("tr")
      newRow.innerHTML = `
          <td>${row.IncidentNumber}</td>
          <td>
            <div>
                <i class="fa-regular fa-copy copy-btn-favorites icon" title="Copy" data-index="${index}"></i>
                <i class="fa-regular fa-eye icon view-btn-favorites "></i>
                <i class="fa-solid fa-trash-can delete-btn-favorites icon" title="Delete" data-index="${index}"></i>

            </div>
          </td>
        `
      tableBody.appendChild(newRow)
    })
  } catch (error) {
    console.error("Error loading favoritesIncList:", error)
  }
}

document
  .querySelector("#data-table-favorites")
  .addEventListener("click", (event) => {
    if (event.target.classList.contains("copy-btn-favorites")) {
      const index = event.target.getAttribute("data-index")
      const instance = favoritesIncs[index]
      const text = `${instance.IncidentNumber}`
      copyToClipboard(text)
    }
    if (event.target.classList.contains("delete-btn-favorites")) {
      const index = event.target.getAttribute("data-index")
      favoritesIncs.splice(index, 1)
      chrome.storage.sync.set({ favorites: favoritesIncs }, () => {
        loadFavoritesIncs()
      })
    }
  })
loadFavoritesIncs()
