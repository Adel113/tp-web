// login.js: connexion via Firebase Auth
window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const messageDiv = document.getElementById('message');

  if (typeof firebase === 'undefined' || !(firebase.apps && firebase.apps.length > 0)) {
    messageDiv.textContent = "Configuration Firebase manquante. Exécutez 'npm run build-config' et rechargez la page.";
    messageDiv.className = 'message error';
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    messageDiv.textContent = '';

    const email = document.getElementById('email').value.trim();
    const motdepasse = document.getElementById('motdepasse').value;

    if (!email || !motdepasse) {
      messageDiv.textContent = 'Veuillez remplir tous les champs.';
      return;
    }

    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, motdepasse);
      // rediriger vers la page compte (le message de vérification est géré sur account)
      const user = userCredential.user;
      window.location.href = 'account.html';
    } catch (err) {
      console.error(err);
      messageDiv.textContent = err.message || 'Erreur lors de la connexion.';
    }
  });
});
