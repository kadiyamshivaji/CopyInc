document.getElementById("inc").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "inc" })
  })
})
document.getElementById("inc+severity").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "inc+severity" })
  })
})

document.getElementById("customOptions").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "customOptions" })
  })
})


/*tree*/
var toggler = document.getElementsByClassName("caret")
var i

for (i = 0; i < toggler.length; i++) {
  toggler[i].addEventListener("click", function () {
    this.parentElement.querySelector(".nested").classList.toggle("active")
    this.classList.toggle("caret-down")
  })
}



/*notes*/
chrome.storage.sync.get("notes", function (data) {
  const notesList = document.getElementById("notesList")
  // Create <li> elements for each note and add click event listeners
  data.notes.forEach((note) => {
    const li = document.createElement("li")
    li.textContent = note.name
    li.className="dropdown-item"
    li.addEventListener("click", () => handleTemplateClick(note))
    notesList.appendChild(li)
  })
})

// Function to handle template click
function handleTemplateClick(note) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "note", template:note.template, name:note.name })
  })
}
