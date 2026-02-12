
# TP Web — Auth & Profil (Firebase)

Petit prototype front-end pour l'inscription, la connexion et la gestion d'un compte utilisateur.

Fonctionnalités
- Inscription (email / mot de passe)
- Envoi d'un email de vérification
- Connexion
- Affichage du profil (`nom`, `prenom`, `email`) stocké dans Realtime Database

Structure du projet
-  fichiers HTML (ouvrir index.html`)
- `src/` : scripts JavaScript (login, signup, account)
- `assets/css/` : fichiers CSS
- `config/` : `firebase-config.js` généré à partir de `.env` (NE PAS committer)

Prérequis
- Node.js et npm
- Un projet Firebase avec Authentication (Email/Password) et Realtime Database activés

Installation
```bash
npm install
```

Configuration
1. Créez un fichier `.env` à la racine.  :

```
Envoyées par mail
```

2. Générez le fichier client `config/firebase-config.js` utilisé par les pages :

```bash
npm run build-config
```

Vérifier sans écrire :

```bash
node scripts/generate-config.js --check
```

Lancer le projet
- Option recommandée : un serveur statique et ouvrez `pages/index.html` :

```bash
# Python 3
python -m http.server 8000

# ou avec un outil Node
npx serve .
```

Ouvrez `http://localhost:8000/pages/`.

