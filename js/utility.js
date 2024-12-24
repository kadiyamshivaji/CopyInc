function copyToClipboard(text) {
    const textarea = document.createElement("textarea")
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
  
    try {
      document.execCommand("copy")
    } catch (err) {
      console.error("Error copying text:", err)
    }
  
    document.body.removeChild(textarea)
  }
  