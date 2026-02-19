
# TP Web — Auth & Profil (Firebase)

Petit prototype front-end pour l'inscription, la connexion et la gestion d'un compte utilisateur.

Fonctionnalités
- Inscription (email / mot de passe)
- Connexion
- Affichage du profil (`nom`, `prenom`, `email`) stocké dans Realtime Database

Structure du projet
- fichiers HTML (ouvrir `index.html`)
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

Ouvrez `http://localhost:'''Port'''/`.

**Sécurité**
- **Validation & sanitization** : `src/security.js` applique l'échappement des entrées et des regex strictes pour `nom`, `prenom`, `email` et mot de passe.
- **Règles Realtime Database** : voir `database.rules.json` — chaque utilisateur ne peut lire/écrire que son propre profil.
- **Vérification d'email** : désactivée dans ce prototype (connexion immédiate après inscription). Pour réactiver, restaurez `sendEmailVerification()` dans `src/signup.js` et la validation `emailVerified` côté `account.js`/DB.
- **Protection anti-brute-force (client)** : verrouillage progressif stocké en `localStorage` (complémentaire — ajouter protection côté serveur pour production).
- **Content Security Policy (CSP)** : les pages contiennent une CSP stricte. Pendant le debug, la CSP a été temporairement assouplie pour permettre `https:` et les sous-domaines `*.firebaseio.com` (long-polling). En production, restreindre la CSP aux hôtes nécessaires.
- **Logs** : le `logger` n'affiche que sur `localhost` pour éviter fuite d'informations en prod.
- **Fichiers sensibles** : `.env` et `config/firebase-config.js` doivent rester dans `.gitignore` et ne jamais être committés.
- **Bonnes pratiques** : HTTPS, pas de scripts inline, `loading="lazy"` pour les images, maintenir dépendances à jour, activer Firebase App Check.

**Notes & dépannage**
- Après avoir ajouté votre `.env`, générez le fichier client avec `npm run build-config`.
- Si `config/firebase-config.js` est déjà présent dans le repo, supprimez-le (`git rm --cached config/firebase-config.js`) et régénérez-le depuis `.env`.

Problèmes courants
- `auth/network-request-failed` ou `400 Bad Request` vers `identitytoolkit.googleapis.com` : vérifiez la connectivité réseau (pare-feu/proxy/VPN) et que la clé API n'est pas restreinte pour localhost. Pour tests locaux, ajoutez `http://localhost:8000` comme referrer dans la console Google Cloud si votre clé est restreinte.
- Erreurs CSP bloquant `*.firebaseio.com` : la CSP a été ajustée pour permettre les sous-domaines RTDB. Si vous durcissez la CSP, ajoutez explicitement les hôtes nécessaires (`www.gstatic.com`, `identitytoolkit.googleapis.com`, `securetoken.googleapis.com`, `www.googleapis.com`, `<your-rtdb>.firebaseio.com`).

Exemple de test curl (vérifier connexion et réponse de l'API) :
```powershell
curl -s -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=TUe_API_KEY" -H "Content-Type: application/json" -d "{\"email\":\"test+uniq@example.com\",\"password\":\"Exemple123\",\"returnSecureToken\":true}"
```

