let activeTabId = ""
let incNum = ""

const getIncNumber = () => {
  try {
    return document.getElementsByClassName(
      "tab-li tab-li-t tab-li-t-ns  selected tab-li-t-ns-selected"
    )[0].children[0].children[0].children[0].children[0].children[0].children[1]
      .children[0].textContent
  } catch (e) {
    alert("Something went wrong")
  }
}

/*  Read the severity and classification from DOM like 'Sev3 Incident' or 'Sev2 Issue'
    OUTPUT:
    return {severity:'Sev3', classificationType :'Issue'} 
*/
const getSeverity = (inc) => {
  try {
    const severityAndType = document
      .querySelector("iframe[title=" + inc + "]")
      .contentWindow.document.getElementsByClassName("heading_3")[0].textContent //
    const severity = severityAndType.split(" ")[0] // To get the severity eg: 'Sev3'
    const classificationType = severityAndType.split(" ")[1] // To get the severity eg: 'Incident or Issue'
    return `${severity} - ${classificationType}`
  } catch (e) {}
}
const getDescription = (inc) => {
  try {
    return document
      .querySelector("iframe[title=" + inc + "]")
      .contentWindow.document.getElementsByClassName("heading_2")[0].textContent
  } catch (e) {}
}
const getFTS = (inc) => {
  try {
    const parentEle = document
      .querySelector("iframe[title=" + inc + "]")
      .contentWindow.document.getElementsByClassName(
        "content-item content-layout item-2 align-end flex flex-row"
      )
    const childEle =
      parentEle[parentEle.length - 1].children[0].children[0].children[0]
        .children
    const status =
      childEle[childEle.length - 2].children[0].children[1].textContent

    return status !== "Standard" ? ` ${status}` : ""
  } catch (e) {}
}

const getAccountName = (inc) => {
  try {
    const iframeContent = document.querySelector("iframe[title=" + inc + "]")
      .contentWindow.document
    return (
      iframeContent.getElementsByClassName("subtitle")[0].textContent +
      iframeContent.getElementsByClassName("subtitle")[1].textContent
    )
  } catch (e) {}
}
const getWfi = (inc) => {
  try {
    const wfi = document
      .querySelector("iframe[title=" + inc + "]")
      .contentWindow.document.getElementsByClassName("heading_3")[2].textContent
    return `WFI-${wfi}`
  } catch (e) {}
}
const getPriority = (inc) => {
  try {
    const priority = document
      .querySelector("iframe[title=" + inc + "]")
      .contentWindow.document.getElementsByClassName("heading_3")[1].textContent
    return `Priority-${priority}`
  } catch (e) {}
}
const getPlatfromversion = (inc) => {
  try {
    const tempList = document
      .querySelector("iframe[title=" + inc + "]")
      .contentWindow.document.getElementsByClassName(
        "content-item content-field item-6"
      )

    return tempList[tempList.length - 2].children[0].children[1].textContent
  } catch (e) {}
}
const isSmeAvailable = (inc) => {
  try {
    const pegaContacts = document
      .querySelector("iframe[title=" + inc + "]")
      .contentWindow.document.getElementsByClassName(
        "content-item content-field item-1 remove-top-spacing remove-bottom-spacing   margin-r-1x dataValueRead flex flex-row"
      )
    return pegaContacts.length > 1 ? `SME-YES` : `SME-NO`
  } catch (e) {}
}
const promteNote = (inc, template) => {
  try {
    const dom = document.querySelector("iframe[title=" + inc + "]")
      .contentWindow.document
    const standardList = dom.getElementsByClassName("standard")
    const primaryContact = standardList[standardList.length - 1].textContent

    const engineer = dom.getElementsByClassName(
      "content-item content-field item-1 remove-top-spacing remove-left-spacing remove-bottom-spacing remove-right-spacing   margin-r-2x link-format-text dataValueRead flex flex-row"
    )[0].children[0].children[0].textContent
    let customNotes =
      `<p>Hello ${primaryContact},</p>` +
      `${template.replace(/\n/g, "<br />")}` +
      `<p>Regards, ${engineer}.</p></div>`
    try {
      const editor = dom
        .querySelectorAll("iframe")[0]
        .contentDocument.getElementsByClassName(
          "cke_editable cke_editable_themed cke_contents_ltr"
        )
      if (editor.length > 0) {
        editor[0].children[0].innerHTML = customNotes
      } else {
        try {
          const commentBox = dom.getElementsByClassName(
            "TANORM textAreaStyle"
          )[0]
          let notes =
            `Hello ${primaryContact}, <br>` +
            `${template.replace(/\n/g, "<br />")}` +
            `Regards, ${engineer}.`
          commentBox.value += `Hello ${primaryContact},`
          commentBox.value += "\n"
          commentBox.value += `${template}`
          commentBox.value += "\n"
          commentBox.value += `Regards, ${engineer}.`
        } catch (e) {
          console.log("******Comment Scenario", e)
        }
      }
    } catch (e) {}
  } catch (e) {
    alert("Please open the editor")
  }
}
const promoteMom =(inc,template) =>{

  try {
    const dom = document.querySelector("iframe[title=" + inc + "]")
      .contentWindow.document
    const standardList = dom.getElementsByClassName("standard")
    const primaryContact = standardList[standardList.length - 1].textContent

    const engineerList = dom.getElementsByClassName(
      "content-item content-field item-1 remove-top-spacing remove-left-spacing remove-bottom-spacing remove-right-spacing   margin-r-2x link-format-text dataValueRead flex flex-row"
    );
    let gcsEngineer =engineerList[0].children[0].children[0].textContent;
    let attenedEngineers = `${gcsEngineer}(Pega)`
    let sme =""
    if(engineerList.length>1){
sme=engineerList[1].children[0].children[0].textContent;
attenedEngineers =`${gcsEngineer}(Pega) and ${sme}(Pega)`
    }
    
    console.log('****',sme)
    let customNotes =
      `<p>Hello ${primaryContact},</p>` +
      `<p>Thank you for your time in the meeting.</p>` +
      `<p><b>Attendees: </b> ${primaryContact}(Client) and ${attenedEngineers}</p>` +
      `<p><b>Call Purpose: </b> To discuss details about the issue</p>` +
      `<p><b>Minutes of meeting:</b></p>` +
      `<p><b>GCS Next actions:</b></p>` +
      `<p><b>Client Next actions:</b></p>` +
      `<p><b>SME Next actions:</b></p>` +
      `<p>Regards, ${gcsEngineer}.</p></div>`
    try {
      const editor = dom
        .querySelectorAll("iframe")[0]
        .contentDocument.getElementsByClassName(
          "cke_editable cke_editable_themed cke_contents_ltr"
          
        )
      if (editor.length > 0) {
        editor[0].children[0].innerHTML = customNotes
      } else {
        try {
          const commentBox = dom.getElementsByClassName(
            "TANORM textAreaStyle"
          )[0]
          commentBox.value += `Hello ${primaryContact},`
          commentBox.value += "\n"
          commentBox.value += `Thank you for your time in the meeting.`
          commentBox.value += "\n"
          commentBox.value += `<b>Attendees</b>:Ranjitha(Client),Rohit(Client),Srinivas(client),Piotr(Pega Engineer), Rahul(Pega Engineer) and Santosh(Pega Engineer). `
         
          commentBox.value += `Regards, ${gcsEngineer}.`
        } catch (e) {
          console.log("******Comment Scenario", e)
        }
      }
    } catch (e) {}
  } catch (e) {
    alert("Please open the editor")
  }
}
function copyToClipboard(text) {
  try {
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
  } catch (e) {}
}

chrome.runtime.sendMessage({ text: "add icon" }, (tabId) => {
  activeTabId = tabId
})

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  try {
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
      const defaultOptions = [
        "Severity",
        "Description",
        "AccountName",
        "WFI",
        "FTS",
        "Priority",
        "Platform",
        "SME",
      ]
      let options = []
      chrome.storage.sync.get("optionKey", function (data) {
        debugger
        options =
          (Object.keys(data).length > 0 && data.optionKey.split(",")) ||
          defaultOptions
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
        copyToClipboard(`${incNum} || ${result}`)
      })
    }
    if (message.action === "note") {
      incNum = getIncNumber()
      if (message.name === "MOM") {
        promoteMom(incNum, message.template)
      } else {
        promteNote(incNum, message.template)
      }
    }
  } catch (e) {}
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
  {
    option: "Platform",
    func: getPlatfromversion,
  },
  {
    option: "SME",
    func: isSmeAvailable,
  },
]
