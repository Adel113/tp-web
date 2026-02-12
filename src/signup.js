// signup.js: crée un utilisateur via Firebase Auth et enregistre le profil sous /utilisateurs/{uid}
window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');
  const messageDiv = document.getElementById('message');

  if (typeof firebase === 'undefined' || !(firebase.apps && firebase.apps.length > 0)) {
    messageDiv.textContent = "Configuration Firebase manquante. Exécutez 'npm run build-config' et rechargez la page.";
    messageDiv.className = 'message error';
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    messageDiv.textContent = '';

    const nom = document.getElementById('nom').value.trim();
    const prenom = document.getElementById('prenom').value.trim();
    const email = document.getElementById('email').value.trim();
    const motdepasse = document.getElementById('motdepasse').value;

    if (!nom || !prenom || !email || !motdepasse) {
      messageDiv.textContent = 'Veuillez remplir tous les champs.';
      return;
    }

    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, motdepasse);
      const user = userCredential.user;
      const uid = user.uid;

      // envoyer email de vérification
      try { await user.sendEmailVerification(); } catch (e) { console.error('sendEmailVerification', e); }

      // Stocker le profil utilisateur (indique emailVerified: false pour l'instant)
      await firebase.database().ref('utilisateurs/' + uid).set({ nom, prenom, email, emailVerified: user.emailVerified || false, createdAt: Date.now() });

      // Rediriger vers la page compte où l'utilisateur verra la demande de vérification
      window.location.href = 'account.html';
    } catch (err) {
      console.error(err);
      messageDiv.textContent = err.message || 'Erreur lors de l\'inscription.';
    }
  });
});
