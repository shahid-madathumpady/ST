document.addEventListener('DOMContentLoaded', () => {
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const signOutBtn = document.getElementById('signOutBtn');
    const settingsEmail = document.getElementById('settingsEmail');

    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', async () => {
            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            if (newPassword !== confirmPassword) {
                alert("New password and confirm password do not match.");
                return;
            }

            if (newPassword.length < 6) {
                alert("Password must be at least 6 characters long.");
                return;
            }

            const user = firebase.auth().currentUser;
            if (user) {
                try {
                    await user.updatePassword(newPassword);
                    alert("Password updated successfully!");
                    newPasswordInput.value = '';
                    confirmPasswordInput.value = '';
                } catch (error) {
                    console.error("Error changing password: ", error);
                    alert("Error changing password: " + error.message);
                }
            } else {
                alert("No user is currently logged in.");
            }
        });
    }

    if (signOutBtn) {
        signOutBtn.addEventListener('click', async () => {
            await firebase.auth().signOut();
            window.location.href = "login.html";
        });
    }

    // Set the user's email on the settings page
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            if (settingsEmail) {
                settingsEmail.textContent = user.email;
            }
        }
    });
});
