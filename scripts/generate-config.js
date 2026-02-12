const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const configPath = path.join(__dirname, '..', 'firebase-config.js');

function loadEnv() {
  if (!fs.existsSync(envPath)) {
    console.error('Erreur: fichier .env manquant. Copiez .env.example vers .env et remplissez les valeurs.');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};

  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      env[key.trim()] = valueParts.join('=').trim();
    }
  });

  return env;
}

function generateConfig(env) {
  const config = `(function() {
  if (typeof firebase === 'undefined') {
    console.error('Firebase script not loaded: include firebase-app-compat.js first');
    return;
  }

  // Config Firebase
  const firebaseConfig = {
    apiKey: "${env.REACT_APP_FIREBASE_API_KEY}",
    authDomain: "${env.REACT_APP_FIREBASE_AUTH_DOMAIN}",
    projectId: "${env.REACT_APP_FIREBASE_PROJECT_ID}",
    storageBucket: "${env.REACT_APP_FIREBASE_STORAGE_BUCKET}",
    messagingSenderId: "${env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID}",
    appId: "${env.REACT_APP_FIREBASE_APP_ID}",
    measurementId: "${env.REACT_APP_FIREBASE_MEASUREMENT_ID}",
    databaseURL: "${env.REACT_APP_FIREBASE_DATABASE_URL}"
  };

  // Initialiser Firebase seulement si pas déjà fait
  if (!firebase.apps || !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized!');
  }

  // Analytics (optionnel)
  if (firebase.analytics) {
    try { firebase.analytics(); } catch (e) { console.warn('Analytics init failed', e); }
  }
})();`;

  return config;
}

function checkConfig() {
  if (!fs.existsSync(envPath)) {
    console.error('Erreur: fichier .env manquant.');
    process.exit(1);
  }

  if (!fs.existsSync(configPath)) {
    console.error('Erreur: firebase-config.js manquant. Lancez npm run build-config.');
    process.exit(1);
  }

  console.log('Configuration OK.');
}

if (process.argv[2] === '--check') {
  checkConfig();
} else {
  const env = loadEnv();
  const config = generateConfig(env);
  fs.writeFileSync(configPath, config, 'utf8');
  console.log('firebase-config.js généré avec succès.');
}
