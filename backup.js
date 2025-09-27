// backup.js
document.addEventListener('DOMContentLoaded', function() {
  const backupBtn = document.getElementById('backupData');
  const restoreBtn = document.getElementById('restoreData');
  const restoreFile = document.getElementById('restoreFile');

  function getData(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  function setData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  if (backupBtn) {
    backupBtn.addEventListener('click', () => {
      const data = {
        quotations: getData('quotations'),
        invoices: getData('invoices'),
        clients: getData('clients')
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_typing_center_${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  if (restoreBtn) {
    restoreBtn.addEventListener('click', () => {
      if (restoreFile) restoreFile.click();
    });
  }

  if (restoreFile) {
    restoreFile.addEventListener('change', function() {
      const file = this.files[0];
      if (!file) return;
      if (!confirm('Restoring will overwrite current quotations, invoices and clients. Continue?')) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const data = JSON.parse(e.target.result);
          if (data.quotations && data.invoices && data.clients) {
            setData('quotations', data.quotations);
            setData('invoices', data.invoices);
            setData('clients', data.clients);
            alert("Backup restored successfully!");
            // Refresh app UI
            if (typeof loadQuotations === 'function') loadQuotations();
            if (typeof loadInvoices === 'function') loadInvoices();
            if (typeof refreshClientTable === 'function') refreshClientTable(); // reinitialize clients UI
            if (typeof updateDashboardStats === 'function') updateDashboardStats();
          } else {
            alert("Invalid backup file.");
          }
        } catch (err) {
          alert("Error reading backup file.");
        }
      };
      reader.readAsText(file);
    });
  }
});