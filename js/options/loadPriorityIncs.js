let priorities = []
const loadPriorityIncs = async () => {
  const tableBody = document.querySelector("#data-table-priority tbody")
  tableBody.innerHTML = ""
  try {
    const { priority = [] } = await chrome.storage.sync.get("priority")
    priorities = priority
    priorities.forEach((row, index) => {
      const newRow = document.createElement("tr")
      newRow.innerHTML = `
          <td>${row.IncidentNumber}</td>
          <td>
            <div>
                <i class="fa-regular fa-copy copy-btn-priority icon"  title="Copy" data-index="${index}"></i>
              <i class="fa-solid fa-trash-can delete-btn-priority icon" title="Delete" data-index="${index}"></i>

            </div>
          </td>
        `
      tableBody.appendChild(newRow)
    })
  } catch (error) {
    console.error("Error loading priorityIncList:", error)
  }
}

document
  .querySelector("#data-table-priority")
  .addEventListener("click", (event) => {
    if (event.target.classList.contains("copy-btn-priority")) {
      const index = event.target.getAttribute("data-index")
      const instance = priorities[index]
      const text = `${instance.IncidentNumber}`
      copyToClipboard(text)
    }
    if (event.target.classList.contains("delete-btn-priority")) {
      const index = event.target.getAttribute("data-index")

      priorities.splice(index, 1)
      chrome.storage.sync.set({ priority: priorities }, () => {
        loadPriorityIncs()
      })
    }
  })

loadPriorityIncs()
