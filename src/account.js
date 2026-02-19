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

      // récupérer le profil depuis Realtime DB
      try {
        const snapshot = await firebase.database().ref('utilisateurs/' + user.uid).once('value');
        const profile = snapshot.val() || {};
        nomEl.textContent = profile.nom || '-';
        prenomEl.textContent = profile.prenom || '-';
        emailEl.textContent = user.email || '-';
      } catch (err) {
        window.__SEC__ && window.__SEC__.logger.error && window.__SEC__.logger.error(err);
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
      window.__SEC__ && window.__SEC__.logger.error && window.__SEC__.logger.error(err);
      messageDiv.textContent = 'Erreur lors de la déconnexion.';
    }
  });
});
