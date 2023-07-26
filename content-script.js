let activeTabId ="";
let incNum ="";
const getIncNumber =() =>{
  return document.getElementsByClassName('tab-li tab-li-t tab-li-t-ns  selected tab-li-t-ns-selected')[0].children[0].children[0].children[0].children[0].children[0].children[1].children[0].textContent;
    
}
const getSeverity=(inc)=>{
  return document.querySelector("iframe[title="+inc+ "]").contentWindow.document.getElementsByClassName('heading_3')[0].textContent
}
const getDescription =(inc)=>{
  return document.querySelector("iframe[title="+inc+ "]").contentWindow.document.getElementsByClassName('heading_2')[0].textContent

}
function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();

  try {
    const successful = document.execCommand('copy');
    const msg = successful ? 'Text copied to clipboard!' : 'Unable to copy text to clipboard';
    console.log(msg);
  } catch (err) {
    console.error('Error copying text:', err);
  }

  document.body.removeChild(textarea);
}

chrome.runtime.sendMessage({ text: "add icon" }, (tabId) => {
  activeTabId = tabId;
});

 chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {

  if(message.action ==='inc'){
    incNum = getIncNumber();
    console.log('****',incNum)
    copyToClipboard(incNum)
   
  }
  if(message.action ==='inc+severity'){
    incNum = getIncNumber();
    console.log('****',incNum)
    const sev = getSeverity(incNum)
    console.log('****',sev)
   
    copyToClipboard("INC-"+incNum + " Severity-" +sev )
  }
  if(message.action ==='inc+severity+desc'){
    incNum = getIncNumber();
    console.log('****',incNum)
    const sev = getSeverity(incNum)
    console.log('****',sev)
    const desc = getDescription(incNum)
    console.log('****',desc)
    copyToClipboard("INC-"+incNum + " Severity-" +sev +" Title- "+desc)
  }
});
