// Function to set up the reminder form
function setupReminderForm() {
    // The reminder fields are part of the main form, so no separate form listener is needed.
    // Logic for saving the reminder is handled in the saveQuotation function in script.js.
}

// Function to save a new reminder to Firebase
async function saveReminder(quotationId, clientName, dueDate, email, description) {
    const newReminder = {
        id: 'R-' + Date.now(),
        quotationId,
        clientName,
        dueDate,
        email,
        description,
        createdAt: new Date().toISOString()
    };

    try {
        await db.collection('reminders').doc(newReminder.id).set(newReminder);
        console.log("Reminder saved for quotation: ", quotationId);
    } catch (e) {
        console.error("Error saving reminder: ", e);
    }
}

// Function to delete a reminder
async function deleteReminder(id) {
    if (!confirm('Delete this reminder?')) return;
    try {
        await db.collection('reminders').doc(id).delete();
        await fetchDataAndRender();
    } catch (e) {
        console.error("Error deleting reminder: ", e);
    }
}