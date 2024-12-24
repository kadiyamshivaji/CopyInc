document.getElementById('import-button').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                chrome.storage.sync.set(data, function() {
                    console.log('Storage data restored successfully.');
                });
            } catch (err) {
                console.error('Failed to parse the file:', err);
            }
        };
        reader.readAsText(file);
    }
});
