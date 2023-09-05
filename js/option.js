let buttonNames = [
  "Severity",
  "Description",
  "AccountName",
  "WFI",
  "FTS",
  "Priority",
  "Platform",
  "SME",
];
const refresh = () => {
  renderButtons(buttonNames);
};
document.getElementById("submit").addEventListener("click", function () {
  const SelectedOptions = [];
  const arr = document.getElementsByClassName("option-item");
  for (let a = 0; a < arr.length; a++) {
    if (arr[a].checked) {
      SelectedOptions.push(arr[a].getAttribute("value"));
    }
  }
  chrome.storage.sync.set({ optionKey: SelectedOptions.toString() });
  buttonNames = SelectedOptions;
  refresh();
  placeHolder.textContent = constructPlaceHolder(buttonNames);
});

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
  ];
  chrome.storage.sync.set({ optionKey: buttonNames.toString() });
  renderButtons(buttonNames);
  placeHolder.textContent = constructPlaceHolder(buttonNames);
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

const buttonList = document.getElementById("buttonList");
const placeHolder = document.getElementById("opions_placeholder");
let draggedButton = null;

function renderButtons(buttonNames) {
  buttonList.innerHTML = "";
  buttonNames.forEach((name) => {
    const button = document.createElement("div");
    const checkbox = document.createElement("input");
    checkbox.type == "check-box";
    button.appendChild(checkbox);
    button.className = "drag-item";
    button.draggable = true;
    button.innerHTML = `<input type="checkbox" id="${name.toLowerCase()}" checked  value="${name}" class="option-item"/> <label for="${name}">${name}</label>`;
    buttonList.appendChild(button);
  });
}

chrome.storage.sync.get("optionKey", function (data) {
  let savedOptions = [];
  savedOptions = (data.optionKey && data.optionKey.split(",")) || [];
  buttonNames = savedOptions.length > 0 ? savedOptions : buttonNames;
  renderButtons(buttonNames);
  placeHolder.textContent = constructPlaceHolder(buttonNames);
});

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
        draggedButton = null;
      }
    }
  }
});

// document
//   .getElementById("saveOwnerShipNote")
//   .addEventListener("click", function () {
//     const note = document.getElementById("ownerShipNote").value;
//     chrome.storage.sync.set({ ownershipNote: note });
//   });

// ********************* Create table on Page Load **************************

document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.sync.get("myTemplates", function (data) {
    if (data["myTemplates"] == undefined) {
      chrome.storage.sync.set({
        myTemplates: [
          {
            Name: "Initial Template Name",
            Content: "Initial Template Content",
          },
        ],
      });
      addTemplate("Initial Template Name", "Initial Template Content");
    } else {
      for (var i = 0; i < data["myTemplates"].length; i++) {
        // Object.keys(data["myTemplates"][i]).forEach(function (key) {
        //   addTemplate(key, data["myTemplates"][i][key]);
        // });
        addTemplate(
          data["myTemplates"][i].Name,
          data["myTemplates"][i].Content
        );
      }
    }
  });
});

// ************************ Add table row with template data **********************

function addTemplate(templateName, templateContent) {
  const tableHTMLNode = document.getElementById("template-table");

  // create a row with sample data
  const row = tableHTMLNode.insertRow(-1);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  cell1.innerHTML = templateName;
  cell2.innerHTML = templateContent;

  const UpdateBtn = document.createElement("button");
  UpdateBtn.setAttribute("class", "btn btn-secondary update-template-btn");
  UpdateBtn.addEventListener("click", updateTemplate, false);
  UpdateBtn.innerText = "Update";
  cell3.appendChild(UpdateBtn);

  const DeleteBtn = document.createElement("button");
  DeleteBtn.setAttribute("class", "btn btn-danger delete-template-btn");
  DeleteBtn.addEventListener("click", deleteRow, false);
  DeleteBtn.innerText = "Delete";
  cell3.appendChild(DeleteBtn);
}

// ****************    Function to add new template row in the table   *************************

document
  .getElementById("create-new-template-btn")
  .addEventListener("click", () =>
    addTemplate("Sample Name", "Sample Content")
  );

// ******************* Function to delete the template row from table ***********************

const deleteBtnArray = document.querySelectorAll(".delete-template-btn");

deleteBtnArray.forEach((el) =>
  el.addEventListener("click", (e) => {
    deleteRow(e);
  })
);

function deleteRow(e) {
  const i = e.target.parentNode.parentNode.rowIndex;
  const res = confirm("Are you sure you want to delete?");
  if (res) {
    const tableHTMLNode = document.getElementById("template-table");
    const row = tableHTMLNode.rows[i];
    if (row != undefined) {
      const DeltedTemplateName = row.cells[0].innerText;
      chrome.storage.sync.get("myTemplates", function (data) {
        let arr = data["myTemplates"];
        const ifExists = arr.filter((e) => e.Name == DeltedTemplateName);
        if (ifExists.length > 0) {
          const index = arr.indexOf(ifExists[0]);
          arr.splice(index, 1);
          chrome.storage.sync.set({
            myTemplates: arr,
          });
        } else {
          alert("An error occurred while deleting the row.");
        }
      });
    } else {
      alert("Some error occurred!!");
    }
    tableHTMLNode.deleteRow(i);
  }
}

// ************************Function to update the template *******************************

const updateBtnArray = document.querySelectorAll(".update-template-btn");

updateBtnArray.forEach((el) =>
  el.addEventListener("click", (e) => {
    updateTemplate(e);
  })
);

function updateTemplate(e) {
  const i = e.target.parentNode.parentNode.rowIndex;

  const tableHTMLNode = document.getElementById("template-table");
  const row = tableHTMLNode.rows[i];
  if (row != undefined) {
    $("#template-name-hidden").val(row.cells[0].innerText);
    $("#template-name").val(row.cells[0].innerText);
    $("#template-content").text(row.cells[1].innerText);
    $("#exampleModal").modal("show");
  } else {
    alert("Some error occurred!!");
  }
}

// ************************Function to save the updated template *******************************

document.getElementById("save-template-btn").addEventListener("click", (e) => {
  chrome.storage.sync.get("myTemplates", function (data) {
    let arr = data["myTemplates"];
    const oldValue = $("#template-name-hidden").val();
    const newTemplateName = $("#template-name").val();
    const newTemplateContent = $("#template-content").val();
    const ifExists = arr.filter((e) => e.Name == oldValue);
    if (ifExists.length > 0) {
      const index = arr.indexOf(ifExists[0]);
      arr[index] = { Name: newTemplateName, Content: newTemplateContent };
    } else {
      arr.push({ Name: newTemplateName, Content: newTemplateContent });
    }
    chrome.storage.sync.set({
      myTemplates: arr,
    });
    $("#exampleModal").modal("hide");
  });
});
