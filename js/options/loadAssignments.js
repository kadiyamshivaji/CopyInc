let assignmentlist =[]
const loadAssignments = async () => {
  const tableBody = document.querySelector("#data-table-assignments tbody");
  tableBody.innerHTML = "";

  try {
    const { assignments = [] } = await chrome.storage.sync.get("assignments");
    assignmentlist =assignments
    assignmentlist.forEach((row, index) => {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td>${row.IncidentNumber}</td>
        <td>${row.Severity}</td>
        <td>${row.Owner}</td>
        <td>
          <div>
            <i class="fa-solid fa-trash-can delete-btn-assignments" data-index="${index}"></i>
          </div>
        </td>
      `;
      tableBody.appendChild(newRow);
    });
  } catch (error) {
    console.error('Error loading assignments:', error);
  }
};

document
  .querySelector("#data-table-assignments")
  .addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn-assignments")) {
      const index = event.target.getAttribute("data-index")
      assignmentlist.splice(index, 1)
      chrome.storage.sync.set({ assignments: assignmentlist }, () => {
        loadAssignments()
      })
    }
  })
document.getElementById("copy-assignment-table").addEventListener("click", function () {
  const el = document.querySelector("#data-table-assignments")
  var body = document.body,
    range,
    sel
  if (document.createRange && window.getSelection) {
    range = document.createRange()
    sel = window.getSelection()
    sel.removeAllRanges()
    range.selectNodeContents(el)
    sel.addRange(range)
  }
  document.execCommand("Copy")
})

loadAssignments();
