
chrome.storage.sync.get("instances", function (data) {
  const notesList = document.getElementById("instancesList")
  // Create <li> elements for each note and add click event listeners
  data.instances.forEach((instant) => {
    const li = document.createElement("li")
    li.textContent = instant.version
    li.addEventListener("click", () => openLoginPage(instant))
    notesList.appendChild(li)
  })
});

/**  Login to instance */

function openLoginPage(instance) {
  const loginPageUrl = instance.url 

  chrome.tabs.create({ url: loginPageUrl }, function (tab) {
    // Replace 'your_username' and 'your_password' with your actual credentials.
    const credentials = {
      username: instance.username,
      password:instance.password
    }

    // Execute a content script in the new tab to provide credentials.
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: injectCredentials,
      args: [credentials],
    })
  })
}

function injectCredentials(credentials) {
  // Fill in the username and password fields with provided credentials.
  document.querySelector("#txtUserID").value = credentials.username
  document.querySelector("#txtPassword").value = credentials.password

  // Submit the login form.
  document.querySelector("#sub").click()

  //document.querySelector("form").submit();
}


