/* instances Table */

// Function to populate the table
let instances = []
function populateInstanceTable() {
  const tableBody = document.querySelector("#data-table-instances tbody")
  tableBody.innerHTML = ""
  chrome.storage.sync.get("instances", function (data) {
    instances = data.instances
    instances.forEach((row, index) => {
      const newRow = document.createElement("tr")
      newRow.innerHTML = `
            <td>${row.version}</td>
            <td>${row.url}</td>
            <td>${row.username}</td>
            <td>${row.password}</td>
            <td>
            <div>
            <i class="fa-regular fa-pen-to-square update-btn-instance" title="Edit" data-index="${index}"></i>
            <i class="fa-solid fa-trash-can delete-btn-instance" data-index="${index}"></i>
            <i class="fa-regular fa-copy copy-btn-instance"  title="Copy" data-index="${index}"></i>
            <div>
               
            </td>
        `
      tableBody.appendChild(newRow)
    })
  })
}

// Event listener for the "Add New Row" button
document.querySelector("#add-instance").addEventListener("click", () => {
  document.querySelector("#version").value = ""
  document.querySelector("#url").value = ""
  document.querySelector("#username").value = ""
  document.querySelector("#password").value = ""
  $("#instanceModal").modal("show")
})

// Event listener for update button
document
  .querySelector("#data-table-instances")
  .addEventListener("click", (event) => {
    if (event.target.classList.contains("update-btn-instance")) {
      const index = event.target.getAttribute("data-index")
      const row = instances[index]
      document.querySelector("#version").value = row.version
      document.querySelector("#url").value = row.url
      document.querySelector("#username").value = row.username
      document.querySelector("#password").value = row.password

      $("#instanceModal").modal("show")
      // Save the index of the row being updated
      document
        .querySelector("#update-instance")
        .setAttribute("data-index", index)
    }
  })

// Event listener for update button in modal
document.querySelector("#update-instance").addEventListener("click", () => {
  const index = document
    .querySelector("#update-instance")
    .getAttribute("data-index")
  const version = document.querySelector("#version").value
  const url = document.querySelector("#url").value
  const username = document.querySelector("#username").value
  const password = document.querySelector("#password").value

  if (index) {
    instances[index].version = version
    instances[index].url = url
    instances[index].username = username
    instances[index].password = password
  } else {
    const newInstance = {
      version,
      url,
      username,
      password,
    }
    instances.push(newInstance)
  }
  const sortedInstanes = sortInstances(instances)
  chrome.storage.sync.set({ instances: sortedInstanes })
  populateInstanceTable()
  $("#instanceModal").modal("hide")
})

// Event listener for delete button
document
  .querySelector("#data-table-instances")
  .addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn-instance")) {
      const index = event.target.getAttribute("data-index")
      instances.splice(index, 1)
      chrome.storage.sync.set({ instances: instances })
      populateInstanceTable()
    }
  })

// Event listener for copy button
document
  .querySelector("#data-table-instances")
  .addEventListener("click", (event) => {
    if (event.target.classList.contains("copy-btn-instance")) {
      const index = event.target.getAttribute("data-index")
      const instance = instances[index]
      const text = `${instance.version} || ${instance.url} || ${instance.username} || ${instance.password}`
      copyToClipboard(text)
    }
  })

function copyToClipboard(text) {
  const textarea = document.createElement("textarea")
  textarea.value = text
  document.body.appendChild(textarea)
  textarea.select()

  try {
    const successful = document.execCommand("copy")
    const msg = successful
      ? "Text copied to clipboard!"
      : "Unable to copy text to clipboard"
    console.log(msg)
  } catch (err) {
    console.error("Error copying text:", err)
  }

  document.body.removeChild(textarea)
}

const sortInstances = (intances) => {
  return intances.sort((a, b) => {
    const versionA = a.version.split(".").map(Number)
    const versionB = b.version.split(".").map(Number)
    for (let i = 0; i < Math.min(versionA.length, versionB.length); i++) {
      if (versionA[i] !== versionB[i]) {
        return versionA[i] - versionB[i]
      }
    }
    return versionA.length - versionB.length
  })
}
// Initial population of the table
populateInstanceTable()
