
chrome.runtime.sendMessage({ text: "add icon" }, (tabId) => {
  activeTabId = tabId.tab;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message="copy inc number"){
    const inc = document.getElementsByClassName('tab-li tab-li-t tab-li-t-ns  selected tab-li-t-ns-selected')[0].children[0].children[0].children[0].children[0].children[0].children[1].children[0].textContent;
    navigator.clipboard.writeText(inc);
  }
});