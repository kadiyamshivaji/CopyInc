
function setIconAndPopup(buildType, tabId) {
  chrome.action.setIcon({
    tabId: tabId,
    path: {
      16: "/assets/icons/16-" + buildType + ".png",
      48: "/assets/icons/48-" + buildType + ".png",
      128: "/assets/icons/128-" + buildType + ".png",
    },
  });
  if(buildType === 'disabled' ){
    chrome.action.setPopup({
      tabId: tabId,
      popup: "/popups/" + buildType + ".html",
    });
  }
 
}
chrome.action.onClicked.addListener((tab,sender, sendResponse) => {
  if(!tab.url.includes("chrome://" && tab.url.includes('pegasupport.pega.com/prweb'))) {
    chrome.tabs.sendMessage(tab.id, "copy inc number");
  }
});



chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.text == "add icon") {
    if(sender.url.includes('pegasupport.pega.com/prweb')){
      setIconAndPopup('pega-app', sender.tab.id);
  } else {
    setIconAndPopup("disabled", sender.tab.id);
  }
  }
});