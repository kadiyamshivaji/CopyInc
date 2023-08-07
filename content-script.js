let activeTabId = ""
let incNum = ""
const getIncNumber = () => {
  return document.getElementsByClassName(
    "tab-li tab-li-t tab-li-t-ns  selected tab-li-t-ns-selected"
  )[0].children[0].children[0].children[0].children[0].children[0].children[1]
    .children[0].textContent
}
const getSeverity = (inc) => {
  return document
    .querySelector("iframe[title=" + inc + "]")
    .contentWindow.document.getElementsByClassName("heading_3")[0].textContent
}
const getDescription = (inc) => {
  return document
    .querySelector("iframe[title=" + inc + "]")
    .contentWindow.document.getElementsByClassName("heading_2")[0].textContent
}
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

function actionClick(inc){
  document
    .querySelector("iframe[title=" + inc + "]")
    .contentWindow.document.getElementsByClassName('content-item content-field item-4 remove-top-spacing remove-bottom-spacing flex flex-row dataValueRead')[0].children[0].children[0].click()
}
chrome.runtime.sendMessage({ text: "add icon" }, (tabId) => {
  activeTabId = tabId
})

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {

  if (message.action === "inc") {
  
    incNum = getIncNumber()
    // actionClick(incNum)
    copyToClipboard(incNum)
  }
  if (message.action === "inc+severity") {
    incNum = getIncNumber()
    const sev = getSeverity(incNum)
    copyToClipboard("INC-" + incNum + " Severity-" + sev)
  }
  if (message.action === "inc+severity+desc") {
    incNum = getIncNumber()
    const sev = getSeverity(incNum)
    const desc = getDescription(incNum)
    copyToClipboard("INC-" + incNum + " Severity-" + sev + " Title- " + desc)
  }
  if(message.action === "customOptions"){
    chrome.storage.sync.get("optionKey", function (data) {
        optionInput.value = data.optionKey || "";
      });
  }
})
