
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

document.getElementById("inc+severity+desc").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "inc+severity+desc" });
  });
});
document.getElementById("customOptions").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    
    chrome.tabs.sendMessage(tabs[0].id, { action: "customOptions" });
  });
});