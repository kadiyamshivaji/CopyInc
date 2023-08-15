
document.getElementById("inc").addEventListener("click", function () {
  
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "inc" });
  });
});
document.getElementById("inc+severity").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "inc+severity" });
  });
});

document.getElementById("customOptions").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    
    chrome.tabs.sendMessage(tabs[0].id, { action: "customOptions" });
  });
});

/*tree*/
var toggler = document.getElementsByClassName("caret");
var i;

for (i = 0; i < toggler.length; i++) {
  toggler[i].addEventListener("click", function() {
    this.parentElement.querySelector(".nested").classList.toggle("active");
    this.classList.toggle("caret-down");
  });
}


/*notes*/
const notes=[{
  name:'Ownership Note',
  template:`\nI'm Shivaji from Pega. I've taken the ownership of the INC to drive towards resolution. I'm currently reviewing the information provided in the INC, I will send out a note if I need more information. I will keep you posted with updates.\n\nIn the meantime, If you need an update or any new information that needs to be shared, please add a note.\n\nThanks for your patience.\n`
},
{
  name:'Priority Issue Update',
  template:`\nThank you for your patience.\n\nWe are working on this on high priority, we are checking with the teams internally to analyze the issue, we will update you soon on this. Thanks,`
},
{
  name:'Screen Share Availability SRequest',
  template:`\nCould you please share your feasible timings for a screenshare to get more details on the configuration. I will send the invite post confirmation.`
},
{
  name:'Act of God',
  template:`As the problem has been resolved through cache clearance, we will be closing the INC by the end of the day.`
},
]

const notesList = document.getElementById('notesList');

// Create <li> elements for each note and add click event listeners
notes.forEach(note => {
  const li = document.createElement('li');
  li.textContent = note.name;
  li.addEventListener('click', () => handleTemplateClick(note.template));
  notesList.appendChild(li);
});

// Function to handle template click
function handleTemplateClick(template) {
  console.log(template);
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    
    chrome.tabs.sendMessage(tabs[0].id, { action: "note" ,template});
  });
}