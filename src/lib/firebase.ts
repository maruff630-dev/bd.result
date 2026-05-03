import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAEskuFl5lVLCMGpGrBAqQjipcPQSKm8S0",
  authDomain: "bd-result-f3d87.firebaseapp.com",
  databaseURL: "https://bd-result-f3d87-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bd-result-f3d87",
  storageBucket: "bd-result-f3d87.firebasestorage.app",
  messagingSenderId: "1012233965521",
  appId: "1:1012233965521:web:a4ea2e871159fff3e7daf0"
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getDatabase(app);
