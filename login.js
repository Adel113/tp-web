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
      const user = userCredential.user;
      try { await user.reload(); } catch (e) { /* ignore reload errors */ }
      if (!user.emailVerified) {
        messageDiv.textContent = 'Veuillez vérifier votre adresse email avant de vous connecter. <button id="resend">Renvoyer le mail</button>';
        messageDiv.className = 'message error';
        // handler resend
        setTimeout(() => {
          const btn = document.getElementById('resend');
          if (btn) btn.addEventListener('click', async () => {
            try {
              await user.sendEmailVerification();
              messageDiv.textContent = 'Email de vérification renvoyé.';
              messageDiv.className = 'message success';
            } catch (e) {
              console.error(e);
              messageDiv.textContent = 'Impossible de renvoyer l\'email.';
            }
          });
        }, 50);
        return;
      }
      window.location.href = 'account.html';
    } catch (err) {
      console.error(err);
      messageDiv.textContent = err.message || 'Erreur lors de la connexion.';
    }
  });
});