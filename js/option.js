let buttonNames = [
  "Severity",
  "Description",
  "AccountName",
  "WFI",
  "FTS",
  "Priority",
  "Platform",
  "SME",
]
const refresh = () => {
  renderButtons(buttonNames)
}
document.getElementById("submit").addEventListener("click", function () {
  const SelectedOptions = []
  const arr = document.getElementsByClassName("option-item")
  for (let a = 0; a < arr.length; a++) {
    if (arr[a].checked) {
      SelectedOptions.push(arr[a].getAttribute("value"))
    }
  }
  chrome.storage.sync.set({ optionKey: SelectedOptions.toString() })
  buttonNames = SelectedOptions
  refresh()
  placeHolder.textContent = constructPlaceHolder(buttonNames)
})

document.getElementById("reset").addEventListener("click", function () {
  buttonNames = [
    "Severity",
    "Description",
    "AccountName",
    "WFI",
    "FTS",
    "Priority",
    "Platform",
    "SME",
  ]
  chrome.storage.sync.set({ optionKey: buttonNames.toString() })
  renderButtons(buttonNames)
  placeHolder.textContent = constructPlaceHolder(buttonNames)
})

const constructPlaceHolder = (options) => {
  let temp = ""
  options.map((item) => {
    if (temp) {
      temp = temp + ` || ${item}`
    } else {
      temp = temp + item
    }
  })
  return temp
}

const buttonList = document.getElementById("buttonList")
const placeHolder = document.getElementById("opions_placeholder")
let draggedButton = null

function renderButtons(buttonNames) {
  buttonList.innerHTML = ""
  buttonNames.forEach((name) => {
    const button = document.createElement("div")
    const checkbox = document.createElement("input")
    checkbox.type == "check-box"
    button.appendChild(checkbox)
    button.className = "drag-item"
    button.draggable = true
    button.innerHTML = `<input type="checkbox" id="${name.toLowerCase()}" checked  value="${name}" class="option-item"/> <label for="${name}">${name}</label>`
    buttonList.appendChild(button)
  })
}

chrome.storage.sync.get("optionKey", function (data) {
  let savedOptions = []
  savedOptions = (data.optionKey && data.optionKey.split(",")) || []
  buttonNames = savedOptions.length > 0 ? savedOptions : buttonNames
  renderButtons(buttonNames)
  placeHolder.textContent = constructPlaceHolder(buttonNames)
})

buttonList.addEventListener("dragstart", (e) => {
  draggedButton = e.target
})

buttonList.addEventListener("dragover", (e) => {
  e.preventDefault()
})

buttonList.addEventListener("drop", (e) => {
  e.preventDefault()
  if (draggedButton !== null) {
    const targetButton = e.target
    if (
      targetButton &&
      targetButton !== draggedButton &&
      targetButton.classList.contains("drag-item")
    ) {
      const buttons = Array.from(buttonList.getElementsByClassName("drag-item"))
      const draggedIndex = buttons.indexOf(draggedButton)
      const targetIndex = buttons.indexOf(targetButton)

      if (draggedIndex !== -1 && targetIndex !== -1) {
        buttonList.removeChild(draggedButton)
        if (draggedIndex < targetIndex) {
          buttonList.insertBefore(draggedButton, targetButton.nextSibling)
        } else {
          buttonList.insertBefore(draggedButton, targetButton)
        }

        // Update array to reflect the new order
        const [removedButton] = buttonNames.splice(draggedIndex, 1)
        buttonNames.splice(targetIndex, 0, removedButton)
        placeHolder.textContent = constructPlaceHolder(buttonNames)
        draggedButton = null
      }
    }
  }
})

/* Notes Table */

// Function to populate the table
let notes = []
function populateTable() {
  const tableBody = document.querySelector("#data-table tbody")
  tableBody.innerHTML = ""
  chrome.storage.sync.get("notes", function (data) {
    notes = data.notes
    notes.forEach((row, index) => {
      if(row.name !=="MOM"){
        const newRow = document.createElement("tr")
        newRow.innerHTML = `
              <td>${row.name}</td>
              <td>${row.template}</td>
              <td>
              <i class="fa-regular fa-pen-to-square update-btn" title="Edit" data-index="${index}"></i>
              <i class="fa-solid fa-trash-can delete-btn" data-index="${index}"></i>
              </td>
          `
        tableBody.appendChild(newRow)
      }
    })
  })
}

// Event listener for the "Add New Row" button
document.querySelector("#add-row").addEventListener("click", () => {
  $("#exampleModal").modal("show")
  // const name = "sample name"
  // const template = "sample content"

  // if (name && template) {
  //   notes.push({ name, template })
  //   chrome.storage.sync.set({ notes: notes })
  //   populateTable()
  // }
})

// Event listener for update button
document.querySelector("#data-table").addEventListener("click", (event) => {
  if (event.target.classList.contains("update-btn")) {
    const index = event.target.getAttribute("data-index")
    const row = notes[index]
    document.querySelector("#update-name").value = row.name
    document.querySelector("#update-content").value = row.template
    $("#exampleModal").modal("show")
    // Save the index of the row being updated
    document.querySelector("#update-btn").setAttribute("data-index", index)
  }
})

// Event listener for update button in modal
document.querySelector("#update-btn").addEventListener("click", () => {
  const index = document.querySelector("#update-btn").getAttribute("data-index")
  const name = document.querySelector("#update-name").value
  const template = document.querySelector("#update-content").value
  if (index) {
    notes[index].name = name
    notes[index].template = template
  }
  else{
    const newNotes = {
      name,
      template
    }
    notes.push(newNotes);
  }

  chrome.storage.sync.set({ notes: notes })
  populateTable()
  $("#exampleModal").modal("hide")
})

// Event listener for delete button
document.querySelector("#data-table").addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const index = event.target.getAttribute("data-index")
    notes.splice(index, 1)
    chrome.storage.sync.set({ notes: notes })
    populateTable()
  }
})

// Initial population of the table
populateTable()
