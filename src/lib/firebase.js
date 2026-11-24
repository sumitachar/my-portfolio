/**
 * Firebase is loaded lazily (dynamic import) so the SDK only downloads when someone
 * actually submits a lead or opens the admin panel, keeping the main bundle small.
 * Config comes from VITE_FIREBASE_* env vars (see .env.example).
 */
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId && config.appId);

let firestorePromise;
let authPromise;

async function getApp() {
  if (!isFirebaseConfigured) throw new Error('firebase-not-configured');
  const { initializeApp, getApps } = await import('firebase/app');
  return getApps()[0] ?? initializeApp(config);
}

/** { db, fs } where fs is the firebase/firestore module. */
export function getFirestoreApi() {
  firestorePromise ??= (async () => {
    const [app, fs] = await Promise.all([getApp(), import('firebase/firestore')]);
    return { db: fs.getFirestore(app), fs };
  })();
  return firestorePromise;
}

/** { auth, api } where api is the firebase/auth module. */
export function getAuthApi() {
  authPromise ??= (async () => {
    const [app, api] = await Promise.all([getApp(), import('firebase/auth')]);
    return { auth: api.getAuth(app), api };
  })();
  return authPromise;
}
