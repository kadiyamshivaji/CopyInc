let activeTabId = ""
let incNum = ""

const getIncNumber = () => {
  return document.getElementsByClassName(
    "tab-li tab-li-t tab-li-t-ns  selected tab-li-t-ns-selected"
  )[0].children[0].children[0].children[0].children[0].children[0].children[1]
    .children[0].textContent
}

/*  Read the severity and classification from DOM like 'Sev3 Incident' or 'Sev2 Issue'
    OUTPUT:
    return {severity:'Sev3', classificationType :'Issue'} 
*/
const getSeverity = (inc) => {
  const severityAndType = document
    .querySelector("iframe[title=" + inc + "]")
    .contentWindow.document.getElementsByClassName("heading_3")[0].textContent //
  const severity = severityAndType.split(" ")[0] // To get the severity eg: 'Sev3'
  const classificationType = severityAndType.split(" ")[1] // To get the severity eg: 'Incident or Issue'
  return `${severity} - ${classificationType}`
}
const getDescription = (inc) => {
  return document
    .querySelector("iframe[title=" + inc + "]")
    .contentWindow.document.getElementsByClassName("heading_2")[0].textContent
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

  return status !== "Standard" ? ` ${status}` : ""
}

const getAccountName = (inc) => {
  const iframeContent = document.querySelector("iframe[title=" + inc + "]")
    .contentWindow.document
  return (
    iframeContent.getElementsByClassName("subtitle")[0].textContent +
    iframeContent.getElementsByClassName("subtitle")[1].textContent
  )
}
const getWfi = (inc) => {
  return document
    .querySelector("iframe[title=" + inc + "]")
    .contentWindow.document.getElementsByClassName("heading_3")[2].textContent
}
const getPriority = (inc) => {
  return document
    .querySelector("iframe[title=" + inc + "]")
    .contentWindow.document.getElementsByClassName("heading_3")[1].textContent
}
const writeOwnershipNote = (inc) => {
  const dom = document.querySelector("iframe[title=" + inc + "]").contentWindow
    .document
  const standardList = dom.getElementsByClassName("standard")
  const primaryContact = standardList[standardList.length - 1].textContent

  const justifyList = dom.getElementsByClassName("leftJustifyStyle")
  const engineer = justifyList[justifyList.length - 1].textContent
  
  let replaceableNote =
    `<p>I'm ${engineer} from Pega. I've taken the ownership of the INC to drive towards resolution. I'm currently reviewing the information provided in the INC, I will send out a note if I need more information. I will keep you posted with updates.</p>` +
    `<p>In the meantime, If you need an update or any new information that needs to be shared, please add a note.</p>` +
    `<p>Thanks for your patience.</p>`

  chrome.storage.sync.get("ownershipNote", function (data) {
    if (data.ownershipNote) {
      replaceableNote = data.ownershipNote.replace(/\n/g, "<br />")
    }
    let ownerShipNote =
      '<div class="rteReadOnlyWithoutTB"><p><strong>Taking Ownership :&nbsp;</strong></p>' +
      `<p>Hello ${primaryContact},</p>` +
      `${replaceableNote}`+
      `<p>Regards, ${engineer}.</p></div>`
    dom
      .querySelectorAll("iframe")[0]
      .contentDocument.getElementsByClassName(
        "cke_editable cke_editable_themed cke_contents_ltr cke_show_borders"
      )[0].children[0].innerHTML = ownerShipNote
  })
  // dom
  //   .querySelectorAll("iframe")[0]
  //   .contentDocument.getElementsByClassName(
  //     "cke_editable cke_editable_themed cke_contents_ltr cke_show_borders"
  //   )[0].children[0].innerHTML = ownerShipNote
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
    let severity = getSeverity(incNum).split("-")[0]
    let classificationType = getSeverity(incNum).split("-")[1]

    const fts = getFTS(incNum)

    if (fts === "") {
      severityAndType =
        severity !== "Sev3" ? `${severity}-${classificationType}` : severity
    } else {
      severityAndType = `${severity}-${classificationType}`
    }
    copyToClipboard(`${incNum}(${severityAndType}${fts})`)
  }
  if (message.action === "inc+severity+desc") {
    incNum = getIncNumber()
    const description = getDescription(incNum)
    let severity = getSeverity(incNum).split("-")[0]
    let classificationType = getSeverity(incNum).split("-")[1]
    copyToClipboard(
      `${incNum} || ${severity}-${classificationType} || ${description}`
    )
  }
  if (message.action === "customOptions") {
    incNum = getIncNumber()

    let options = []
    chrome.storage.sync.get("optionKey", function (data) {
      options = data.optionKey.split(",")
      let result = ""
      options.map((item) => {
        const tempResult = mapOptions
          .filter((opt) => opt.option === item)[0]
          .func(incNum)

        if (result) {
          result = tempResult ? result + ` || ${tempResult}` : result
        } else {
          result = tempResult
        }
      })
      copyToClipboard(result)
    })
  }
  if (message.action === "ownership") {
    incNum = getIncNumber()
    writeOwnershipNote(incNum)
  }
})

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
    func: getAccountName,
  },
  {
    option: "WFI",
    func: getWfi,
  },
  {
    option: "FTS",
    func: getFTS,
  },
  {
    option: "Priority",
    func: getPriority,
  },
]
