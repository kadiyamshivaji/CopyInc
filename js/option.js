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
  const SelectedOptions = [];
  const arr = document.getElementsByClassName("option-item");
  for (let a = 0; a < arr.length; a++) {
    if (arr[a].checked) {
      SelectedOptions.push(arr[a].getAttribute("id"));
    }
  }
  chrome.storage.sync.set({ optionKey: SelectedOptions.toString() });
  // });
});

const constructPlaceHolder = (options) => {
  let temp = "";
  options.map((item) => {
    if (temp) {
      temp = temp + ` || ${item}`;
    } else {
      temp = temp + item;
    }
  });
  return temp;
};
const buttonNames = [
  "Incident Number",
  "Severity",
  "Description",
  "AccountName",
  "WFI",
];

const buttonList = document.getElementById("buttonList");
const placeHolder = document.getElementById("opions_placeholder");
let draggedButton = null;

function renderButtons() {
  buttonList.innerHTML = "";
  buttonNames.forEach((name) => {
    const button = document.createElement("div");
    const checkbox = document.createElement("input");
    checkbox.type == "check-box";
    button.appendChild(checkbox);
    button.className = "drag-item";
    button.draggable = true;
    button.innerHTML = `<input type="checkbox" id="${name}"  value="${name}" class="option-item"/> <label for="${name}">${name}</label>`;
    buttonList.appendChild(button);
  });
}

renderButtons();

buttonList.addEventListener("dragstart", (e) => {
  draggedButton = e.target;
});

buttonList.addEventListener("dragover", (e) => {
  e.preventDefault();
});

buttonList.addEventListener("drop", (e) => {
  e.preventDefault();
  if (draggedButton !== null) {
    const targetButton = e.target;
    if (
      targetButton &&
      targetButton !== draggedButton &&
      targetButton.classList.contains("drag-item")
    ) {
      const buttons = Array.from(
        buttonList.getElementsByClassName("drag-item")
      );
      const draggedIndex = buttons.indexOf(draggedButton);
      const targetIndex = buttons.indexOf(targetButton);

      if (draggedIndex !== -1 && targetIndex !== -1) {
        buttonList.removeChild(draggedButton);
        if (draggedIndex < targetIndex) {
          buttonList.insertBefore(draggedButton, targetButton.nextSibling);
        } else {
          buttonList.insertBefore(draggedButton, targetButton);
        }

        // Update array to reflect the new order
        const [removedButton] = buttonNames.splice(draggedIndex, 1);
        buttonNames.splice(targetIndex, 0, removedButton);
        placeHolder.textContent = constructPlaceHolder(buttonNames);
        console.log("********", buttonNames);
        draggedButton = null;
      }
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.sync.get("optionKey", function (data) {
    const SelectedOptions = data["optionKey"]
      ? data["optionKey"].split(",")
      : "";
    if (SelectedOptions.length > 0) {
      for (let a = 0; a < SelectedOptions.length; a++) {
        document
          .getElementById(SelectedOptions[a])
          .setAttribute("checked", true);
      }
    }
  });
});
