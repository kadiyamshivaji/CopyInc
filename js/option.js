document.getElementById("submit").addEventListener("click", function () {
  // const incNum = document.getElementById('incNum').checked;
  // const severity = document.getElementById('severity').checked;
  // const description = document.getElementById('description').checked;
  // const wifi = document.getElementById('wifi').checked;

  // // Load the option from storage and display it in the input field
  // chrome.storage.sync.get("optionKey", function (data) {
  //     optionInput.value = data.optionKey || "";
  // });

  // Save the option when the Save button is clicked
  // saveButton.addEventListener('click', function () {
  const options = ["incNum", "severity", "description", "wifi"]
  chrome.storage.sync.set({ optionKey: options.toString() })
  // });
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
const buttonNames = [
  "IncidentNo",
  "Severity",
  "Description",
  "AccountName",
  "Wifi",
]

const buttonList = document.getElementById("buttonList")
const placeHolder = document.getElementById("opions_placeholder")
let draggedButton = null

function renderButtons() {
  buttonList.innerHTML = ""
  buttonNames.forEach((name) => {
    const button = document.createElement("div")
    const checkbox = document.createElement("input")
    checkbox.type == "check-box"
    button.appendChild(checkbox)
    button.className = "drag-item"
    button.draggable = true
    button.innerHTML = `<input type="checkbox" id="${name}"  value="${name}"/> <label for="vehicle1">${name}</label>`
    buttonList.appendChild(button)
  })
}

renderButtons()

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
