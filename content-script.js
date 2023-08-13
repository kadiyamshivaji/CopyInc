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

function actionClick(inc) {
  document
    .querySelector("iframe[title=" + inc + "]")
    .contentWindow.document.getElementsByClassName(
      "content-item content-field item-4 remove-top-spacing remove-bottom-spacing flex flex-row dataValueRead"
    )[0]
    .children[0].children[0].click()
}

const getFTS = (inc) => {
  const parentEle = document
    .querySelector("iframe[title=" + inc + "]")
    .contentWindow.document.getElementsByClassName(
      "content-item content-layout item-2 align-end flex flex-row"
    )
  const childEle =
    parentEle[parentEle.length - 1].children[0].children[0].children[0].children
  const status =
    childEle[childEle.length - 2].children[0].children[1].textContent

  return status !== "Standard" ? `-${status}` : ""
}

chrome.runtime.sendMessage({ text: "add icon" }, (tabId) => {
  activeTabId = tabId
})

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "inc") {
    incNum = getIncNumber()

    copyToClipboard(incNum)
  }
  if (message.action === "inc+severity") {
    incNum = getIncNumber()
    const sev = getSeverity(incNum)
    const fts = getFTS(incNum)
    copyToClipboard(`${incNum}(${sev}${fts} )`)
  }
  if (message.action === "inc+severity+desc") {
    incNum = getIncNumber()
    const desc = getDescription(incNum)
    copyToClipboard(`${incNum} || ${sev} || ${desc}`)
  }
  if (message.action === "customOptions") {
    incNum = getIncNumber()
    const mapOptions = [
      {
        option: "IncidentNumber",
        func: getIncNumber,
      },
      {
        option: "Severity",
        func: getSeverity,
      },
      {
        option: "Description",
        func: getDescription,
      },
      {
        option: "AccountName",
        func: getIncNumber,
      },
      {
        option: "Wifi",
        func: getIncNumber,
      },
    ]
    const options = [
      "IncidentNumber",
      "Severity",
      "Description",
      "AccountName",
      "Wifi",
    ]
    let str = ""
    options.map((item) => {
      const text = mapOptions
        .filter((opt) => opt.option === item)[0]
        .func(incNum)
      if (str) {
        str = str + ` || ${text}`
      } else {
        str = text
      }
    })
    copyToClipboard(str)
    //console.log('888',str)
    // chrome.storage.sync.get("optionKey", function (data) {
    //     optionInput.value = data.optionKey || "";
    //   });
  }
})
