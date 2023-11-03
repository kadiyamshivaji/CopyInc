function setIconAndPopup(buildType, tabId) {
  chrome.action.setIcon({
    tabId: tabId,
    path: {
      16: "/assets/icons/16-" + buildType + ".png",
      48: "/assets/icons/48-" + buildType + ".png",
      128: "/assets/icons/128-" + buildType + ".png",
    },
  })
  if (buildType === "disabled") {
    chrome.action.setPopup({
      tabId: tabId,
      popup: "/html/popups/" + buildType + ".html",
    })
  }
}
// chrome.action.onClicked.addListener((tab,sender, sendResponse) => {
//   if(!tab.url.includes("chrome://" && tab.url.includes('pegasupport.pega.com/prweb'))) {
//     chrome.tabs.sendMessage(tab.id, "copy inc number");
//   }
// });

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.text == "add icon") {
    if (sender.url.includes("pegasupport.pega.com/prweb")) {
      setIconAndPopup("pega-app", sender.tab.id)
    } else {
      setIconAndPopup("disabled", sender.tab.id)
    }
  }
  sendResponse({ tab: sender.tab.id })
})

// Function to copy text to clipboard
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

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "copyToClipboard") {
    copyToClipboard(message.text)
  }
})
const notes = [
  {
    name: "Ownership Note",
    template: `\nI'm Shivaji from Pega. I've taken the ownership of the INC to drive towards resolution. I'm currently reviewing the information provided in the INC, I will send out a note if I need more information. I will keep you posted with updates.\n\nIn the meantime, If you need an update or any new information that needs to be shared, please add a note.\n\nThanks for your patience.\n`,
  },
  {
    name:"MOM",
    template:``
  },
  {
    name: "Priority Issue Update",
    template: `\nThank you for your patience.\n\nWe are working on this on high priority, we are checking with the teams internally to analyze the issue, we will update you soon on this. Thanks,`,
  },
  {
    name: "Screen Share Availability SRequest",
    template: `\nCould you please share your feasible timings for a screenshare to get more details on the configuration. I will send the invite post confirmation.`,
  },
  {
    name: "Act of God",
    template: `As the problem has been resolved through cache clearance, we will be closing the INC by the end of the day.`,
  },
  {
    name: "Empty Template",
    template: `\n`,
  },
  {
    name: "No Queries",
    template: `If no further queries we will resolve the INC`,
  },
]
const buttonNames = [
  "Severity",
  "Description",
  "AccountName",
  "WFI",
  "FTS",
  "Priority",
  "Platform",
  "SME",
]
const instances = [
  {
    version: "8.6.5",
    url: "https://10.60.215.144:8443/prweb",
    username: "kadis1",
    password: "rules",
  },
  {
    version: "8.8.3",
    url: "https://lab0792.lab.pega.com/prweb",
    username: "kadis1",
    password: "rules",
  },
]
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === "install") {
    // This code runs only when the extension is first installed

    // Set default values for your extension's settings
    chrome.storage.sync.set({
      notes: notes,
      optionKey: buttonNames.toString(),
      instances: instances,
    })
  }
})
