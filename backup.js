document.addEventListener('DOMContentLoaded', function() {
  const backupBtn = document.getElementById('backupData');
  const restoreBtn = document.getElementById('restoreData');
  const restoreFile = document.getElementById('restoreFile');
  // const db = firebase.firestore(); - This line was removed to prevent duplicate variable errors

  if (backupBtn) {
    backupBtn.addEventListener('click', async () => {
      try {
        const quotationsSnapshot = await db.collection('quotations').get();
        const invoicesSnapshot = await db.collection('invoices').get();
        const clientsSnapshot = await db.collection('clients').get();

        const data = {
          quotations: quotationsSnapshot.docs.map(doc => doc.data()),
          invoices: invoicesSnapshot.docs.map(doc => doc.data()),
          clients: clientsSnapshot.docs.map(doc => doc.data())
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_typing_center_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        alert("✅ Backup created successfully!");
      } catch (e) {
        console.error("Error creating backup: ", e);
        alert("❌ Error creating backup.");
      }
    });
  }

  if (restoreBtn) {
    restoreBtn.addEventListener('click', () => {
      if (restoreFile) restoreFile.click();
    });
  }

  if (restoreFile) {
    restoreFile.addEventListener('change', async function() {
      const file = this.files[0];
      if (!file) return;

      if (!confirm('Restoring will overwrite current quotations, invoices, and clients. Continue?')) return;

      const reader = new FileReader();
      reader.onload = async function(e) {
        try {
          const data = JSON.parse(e.target.result);
          if (data.quotations && data.invoices && data.clients) {
            const batch = db.batch();

            const collectionsToClear = ['quotations', 'invoices', 'clients'];
            for (const collectionName of collectionsToClear) {
              const snapshot = await db.collection(collectionName).get();
              snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
              });
            }

            data.quotations.forEach(q => {
              const docRef = db.collection('quotations').doc(q.id);
              batch.set(docRef, q);
            });
            data.invoices.forEach(i => {
              const docRef = db.collection('invoices').doc(i.id);
              batch.set(docRef, i);
            });
            data.clients.forEach(c => {
              const docRef = db.collection('clients').doc(c.id);
              batch.set(docRef, c);
            });

            await batch.commit();
            alert("✅ Backup restored successfully! Please refresh the page.");
            window.location.reload();
          } else {
            alert("Invalid backup file. It must contain 'quotations', 'invoices', and 'clients' arrays.");
          }
        } catch (err) {
          console.error("Error restoring backup: ", err);
          alert("❌ Error reading or restoring backup file.");
        }
      };
      reader.readAsText(file);
    });
  }
});