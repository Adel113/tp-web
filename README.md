# TP Web — Auth & Profil (Firebase)

Petit prototype front-end pour l'inscription, la connexion et la gestion d'un compte utilisateur.

Fonctionnalités
- Inscription (email / mot de passe)
- Envoi d'un email de vérification
- Connexion
- Affichage du profil (`nom`, `prenom`, `email`) stocké dans Realtime Database

Prérequis
- Node.js et npm
- Un projet Firebase avec Authentication (Email/Password) et Realtime Database activés

Installation
```bash
npm install
```

Configuration
1. Créez un fichier `.env` à la racine avec les variables : 

```
Envoyées par mail 
```

2. Générez le fichier client `firebase-config.js` utilisé par les pages :

```bash
npm run build-config
```

Ligne de commande pour vérifier sans écrire :

```bash
node scripts/generate-config.js --check
```

Lancer le projet
- Option simple (ouvrir en local) : double-cliquez sur `index.html` dans le dossier.
- Option recommandée (serveur statique pour éviter des problèmes de CORS/paths) :

```bash
# Python 3
python -m http.server 8000

# ou avec un outil Node
npx serve .
```

Ouvrez ensuite `http://localhost:8000`.

