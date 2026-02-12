// account.js: affiche le profil utilisateur et gère la déconnexion
window.addEventListener('DOMContentLoaded', () => {
  const nomEl = document.getElementById('nom');
  const prenomEl = document.getElementById('prenom');
  const emailEl = document.getElementById('email');
  const messageDiv = document.getElementById('message');
  const logoutBtn = document.getElementById('logout');
  if (typeof firebase === 'undefined' || !(firebase.apps && firebase.apps.length > 0)) {
    messageDiv.textContent = "Configuration Firebase manquante. Exécutez 'npm run build-config' et rechargez la page.";
    messageDiv.className = 'message error';
    return;
  }

  // Vérifier l'état d'authentification
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      try { await user.reload(); } catch (e) { /* ignore reload errors */ }
      if (!user.emailVerified) {
        messageDiv.innerHTML = 'Adresse non vérifiée. Vérifiez votre boîte mail. <button id="resend">Renvoyer l\'email</button>';
        messageDiv.className = 'message error';
        document.getElementById('nom').textContent = '-';
        document.getElementById('prenom').textContent = '-';
        document.getElementById('email').textContent = user.email || '-';
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
      // récupérer le profil depuis Realtime DB
      try {
        const snapshot = await firebase.database().ref('utilisateurs/' + user.uid).once('value');
        const profile = snapshot.val() || {};
        nomEl.textContent = profile.nom || '-';
        prenomEl.textContent = profile.prenom || '-';
        emailEl.textContent = user.email || '-';
      } catch (err) {
        console.error(err);
        messageDiv.textContent = 'Impossible de récupérer le profil.';
      }
    } else {
      // Rediriger si non authentifié
      window.location.href = 'login.html';
    }
  });

  logoutBtn.addEventListener('click', async () => {
    try {
      await firebase.auth().signOut();
      window.location.href = 'index.html';
    } catch (err) {
      console.error(err);
      messageDiv.textContent = 'Erreur lors de la déconnexion.';
    }
  });
});