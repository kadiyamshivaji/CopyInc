       document.getElementById("submit").addEventListener("click", function () {
            // const incNum = document.getElementById('incNum').checked;
            // const severity = document.getElementById('severity').checked;
            // const description = document.getElementById('description').checked;
            // const wifi = document.getElementById('wifi').checked;



            // // Load the option from storage and display it in the input field
            // chrome.storage.sync.get("optionKey", function (data) {
            //     optionInput.value = data.optionKey || "";
            // });

            // Save the option when the Save button is clicked
            // saveButton.addEventListener('click', function () {
                const options =['incNum','severity','description','wifi']
                chrome.storage.sync.set({ "optionKey": options.toString() });
            // });
        });