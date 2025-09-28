document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm.loginEmail.value;
      const password = loginForm.loginPassword.value;
      
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        window.location.href = "index.html";
      } catch (error) {
        console.error("Login failed: ", error);
        alert("Login failed: " + error.message);
      }
    });
  }
});