// Render client table from Firebase
async function refreshClientTable(clients) {
    const tbody = document.getElementById('clientTable');
    if (!tbody) return;
    tbody.innerHTML = '';

    try {
        clients.forEach((client, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${i + 1}</td>
                <td>${escapeHtml(client.name)}</td>
                <td>${escapeHtml(client.company)}</td>
                <td>${escapeHtml(client.email)}</td>
                <td>${escapeHtml(client.phone)}</td>
                <td>${client.createdAt}</td>
                <td>
                    <button onclick="deleteClient('${client.id}')" class="btn btn-danger">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        refreshClientDropdown(clients);
        updateDashboardStats();
    } catch (e) {
        console.error("Error refreshing clients: ", e);
    }
}

// Refresh dropdown in quotations form from Firebase data
function refreshClientDropdown(clients) {
    const select = document.getElementById('clientSelect');
    if (!select) return;
    select.innerHTML = '<option value="">-- Choose client --</option>';
    clients.forEach((c) => {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = c.company || c.name;
        select.appendChild(option);
    });
}

// Add new client to Firebase
async function saveClient() {
    const name = document.getElementById('newClientName').value.trim();
    const email = document.getElementById('newClientEmail').value.trim();
    const phone = document.getElementById('newClientPhone').value.trim();
    const company = document.getElementById('newClientCompany').value.trim();
    const isVIP = document.getElementById('newClientVIP').checked;

    if (!name && !company) {
        alert("Client name or Company name is required!");
        return;
    }

    const newClient = {
        id: 'C-' + Date.now(),
        name,
        email,
        phone,
        company,
        isVIP,
        createdAt: new Date().toLocaleString()
    };

    try {
        await db.collection('clients').doc(newClient.id).set(newClient);
        document.getElementById('newClientName').value = '';
        document.getElementById('newClientEmail').value = '';
        document.getElementById('newClientPhone').value = '';
        document.getElementById('newClientCompany').value = '';
        document.getElementById('newClientVIP').checked = false;

        fetchDataAndRender();
        alert("✅ Client added successfully!");
    } catch (e) {
        console.error("Error adding client: ", e);
        alert("❌ Error adding client.");
    }
}

// Delete client from Firebase
window.deleteClient = async function(id) {
    if (!confirm("Delete this client?")) return;
    try {
        await db.collection('clients').doc(id).delete();
        fetchDataAndRender();
    } catch (e) {
        console.error("Error deleting client: ", e);
    }
};

// Export clients CSV from Firebase data
async function exportClientsCSV() {
    try {
        const clients = allClients;

        if (clients.length === 0) {
            alert("No clients to export!");
            return;
        }

        const rows = [['ID', 'Name', 'Company', 'Email', 'Phone', 'VIP', 'Created At']];
        clients.forEach((c) => rows.push([c.id, c.name, c.company, c.email, c.phone, c.isVIP ? 'Yes' : 'No', c.createdAt]));

        const csvContent = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'clients.csv';
        link.click();
    } catch (e) {
        console.error("Error exporting clients: ", e);
    }
}

const btnSave = document.getElementById('saveClient');
const btnExport = document.getElementById('exportClientsCSV');

if (btnSave) btnSave.addEventListener('click', saveClient);
if (btnExport) btnExport.addEventListener('click', () => exportClientsCSV(allClients));