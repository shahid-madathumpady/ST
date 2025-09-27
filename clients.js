let clients = JSON.parse(localStorage.getItem('clients')) || [];

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// Render client table
function refreshClientTable() {
    const tbody = document.getElementById('clientTable');
    if (!tbody) return;
    tbody.innerHTML = '';
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
    refreshClientDropdown();
    updateDashboardStats(); // Ensure dashboard stats are updated after client changes
}

// Refresh dropdown in quotations form
function refreshClientDropdown() {
    const select = document.getElementById('clientSelect');
    if (!select) return;
    select.innerHTML = '<option value="">-- Choose client --</option>';
    clients.forEach((c) => {
        const option = document.createElement('option');
        // Use the client's unique ID for the dropdown value
        option.value = c.id;
        // Display company name in the dropdown, or personal name if company is not provided
        option.textContent = c.company || c.name;
        select.appendChild(option);
    });
}

// Add new client
function saveClient() {
    const name = document.getElementById('newClientName').value.trim();
    const email = document.getElementById('newClientEmail').value.trim();
    const phone = document.getElementById('newClientPhone').value.trim();
    const company = document.getElementById('newClientCompany').value.trim();
    const isVIP = document.getElementById('newClientVIP').checked;

    if (!name && !company) {
        alert("Client name or Company name is required!");
        return;
    }

    // Assign a unique ID to each new client
    const newClient = {
        id: 'C-' + Date.now(),
        name,
        email,
        phone,
        company,
        isVIP,
        createdAt: new Date().toLocaleString()
    };

    clients.push(newClient);
    localStorage.setItem('clients', JSON.stringify(clients));

    // Clear input fields
    document.getElementById('newClientName').value = '';
    document.getElementById('newClientEmail').value = '';
    document.getElementById('newClientPhone').value = '';
    document.getElementById('newClientCompany').value = '';
    document.getElementById('newClientVIP').checked = false;

    refreshClientTable();
    alert("✅ Client added successfully!");
}

// Delete client
window.deleteClient = function(id) {
    if (!confirm("Delete this client?")) return;
    clients = clients.filter(client => client.id !== id);
    localStorage.setItem('clients', JSON.stringify(clients));
    refreshClientTable();
};

// Export clients CSV
function exportClientsCSV() {
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
}

// Attach events after DOM loaded
const btnSave = document.getElementById('saveClient');
const btnExport = document.getElementById('exportClientsCSV');

if (btnSave) btnSave.addEventListener('click', saveClient);
if (btnExport) btnExport.addEventListener('click', exportClientsCSV);