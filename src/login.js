// login.js: connexion via Firebase Auth
window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const messageDiv = document.getElementById('message');
  const submitBtn = form.querySelector('button[type="submit"]');

  if (typeof firebase === 'undefined' || !(firebase.apps && firebase.apps.length > 0)) {
    messageDiv.textContent = "Configuration Firebase manquante. Exécutez 'npm run build-config' et rechargez la page.";
    messageDiv.className = 'message error';
    return;
  }

  const S = window.__SEC__;

  function setGenericAuthError(){
    messageDiv.textContent = 'Identifiants invalides ou compte non activé.';
    messageDiv.className = 'message error';
  }

  async function handleLockout(email){
    const key = email || 'global';
    const info = S.getAttemptInfo(key);
    if (info.nextAllowed && Date.now() < info.nextAllowed){
      const remaining = Math.ceil((info.nextAllowed - Date.now())/1000);
      submitBtn.disabled = true;
      messageDiv.textContent = `Trop de tentatives. Réessayez dans ${remaining}s.`;
      setTimeout(() => {
        submitBtn.disabled = false;
        messageDiv.textContent = '';
      }, remaining * 1000 + 200);
      return true;
    }
    return false;
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

    if (!S.validateEmail(email)){
      messageDiv.textContent = 'Email invalide.';
      return;
    }

    if (await handleLockout(email)) return;

    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, motdepasse);
      const user = userCredential.user;
      // successful login -> reset attempts for this key
      S.resetAttempts(email);
      window.location.href = 'account.html';
    } catch (err) {
      S.logger.error(err);
      S.recordFailedAttempt(email);
      setGenericAuthError();
      const info = S.getAttemptInfo(email);
      if (info.count >= 5){
        const remaining = Math.ceil((info.nextAllowed - Date.now())/1000);
        submitBtn.disabled = true;
        messageDiv.textContent = `Trop de tentatives. Réessayez dans ${remaining}s.`;
        setTimeout(() => { submitBtn.disabled = false; messageDiv.textContent = ''; }, remaining * 1000 + 200);
      }
    }
  });
});
