// signup.js: crée un utilisateur via Firebase Auth et enregistre le profil sous /utilisateurs/{uid}
window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');
  const messageDiv = document.getElementById('message');

  if (typeof firebase === 'undefined' || !(firebase.apps && firebase.apps.length > 0)) {
    messageDiv.textContent = "Configuration Firebase manquante. Exécutez 'npm run build-config' et rechargez la page.";
    messageDiv.className = 'message error';
    return;
  }

  const S = window.__SEC__;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    messageDiv.textContent = '';

    const nomRaw = document.getElementById('nom').value.trim();
    const prenomRaw = document.getElementById('prenom').value.trim();
    const emailRaw = document.getElementById('email').value.trim();
    const motdepasse = document.getElementById('motdepasse').value;

    if (!nomRaw || !prenomRaw || !emailRaw || !motdepasse) {
      messageDiv.textContent = 'Veuillez remplir tous les champs.';
      return;
    }

    if (!S.validateName(nomRaw) || !S.validateName(prenomRaw)){
      messageDiv.textContent = 'Nom ou prénom invalide.';
      return;
    }

    if (!S.validateEmail(emailRaw)){
      messageDiv.textContent = 'Email invalide.';
      return;
    }

    if (!S.validatePassword(motdepasse)){
      messageDiv.textContent = 'Mot de passe trop faible. (min 8, majuscule, minuscule, chiffre)';
      return;
    }

    const nom = S.escapeHtml(nomRaw);
    const prenom = S.escapeHtml(prenomRaw);
    const email = emailRaw;

    try {
      S.logger.debug && S.logger.debug('signup payload', { email, nom, prenom });
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, motdepasse);
      const user = userCredential.user;
      const uid = user.uid;

      await firebase.database().ref('utilisateurs/' + uid).set({ nom, prenom, email, createdAt: Date.now() });

      // Inscription réussie : l'utilisateur reste connecté et est redirigé
      messageDiv.textContent = 'Inscription réussie.';
      messageDiv.className = 'message success';
      setTimeout(() => window.location.href = 'account.html', 1200);
    } catch (err) {
      const code = err && err.code ? err.code : '';
      S.logger.debug && S.logger.debug('signup error object', err);
      if (err && err.stack) S.logger.debug && S.logger.debug(err.stack);
      if (code === 'auth/weak-password') {
        messageDiv.textContent = 'Mot de passe trop faible.';
        messageDiv.className = 'message error';
      } else if (code === 'auth/email-already-in-use') {
        // log only in dev
        S.logger.warn && S.logger.warn('signup: email already in use');

        messageDiv.textContent = 'Un compte existe déjà pour cet email. Si c\'est vous, connectez-vous ou réinitialisez le mot de passe.';
        messageDiv.className = 'message error';

        const actions = document.createElement('div');
        actions.style.marginTop = '8px';

        const resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.textContent = 'Réinitialiser le mot de passe';
        resetBtn.addEventListener('click', async () => {
          resetBtn.disabled = true;
          try {
            await firebase.auth().sendPasswordResetEmail(email);
            messageDiv.textContent = 'Si un compte existe, vous recevrez un email pour réinitialiser le mot de passe.';
            messageDiv.className = 'message success';
          } catch (e) {
            S.logger.error && S.logger.error(e);
            messageDiv.textContent = 'Impossible de lancer la réinitialisation. Réessayez plus tard.';
            messageDiv.className = 'message error';
          }
        });

        const loginLink = document.createElement('button');
        loginLink.type = 'button';
        loginLink.textContent = 'Aller à la connexion';
        loginLink.style.marginLeft = '8px';
        loginLink.addEventListener('click', () => { window.location.href = 'login.html'; });

        actions.appendChild(resetBtn);
        actions.appendChild(loginLink);
        messageDiv.appendChild(document.createElement('br'));
        messageDiv.appendChild(actions);
      } else {
        S.logger.error && S.logger.error(err);
        if (S && S.isDev) {
          messageDiv.textContent = `${err && err.code ? err.code + ': ' : ''}${err && err.message ? err.message : 'Erreur lors de l\'inscription.'}`;
        } else {
          messageDiv.textContent = 'Impossible de créer le compte. Vérifiez vos informations.';
        }
        messageDiv.className = 'message error';
      }
    }
  });
});
