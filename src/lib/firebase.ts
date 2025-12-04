import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyAuXWQxFmX15nlqrVhqqkeGl8adR2ih9OA",
  authDomain: "ecoretail-a6a51.firebaseapp.com",
  projectId: "ecoretail-a6a51",
  storageBucket: "ecoretail-a6a51.firebasestorage.app",
  messagingSenderId: "964616518787",
  appId: "1:964616518787:web:8a0bc286b31e8a8bd06fb6",
  measurementId: "G-MXDB1FNJ57"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
