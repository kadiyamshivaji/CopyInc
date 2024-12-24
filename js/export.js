document.getElementById('export-button').addEventListener('click', function() {
    chrome.storage.sync.get(null, function(items) {
        const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'storage_backup.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});
