import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore"; // ✅ Add Firestore
import { getStorage } from "firebase/storage"; // ✅ Add Storage

const firebaseConfig = {
  apiKey: "AIzaSyCpnebRG7bHGbtXRBjTuiQAuElegAy7Xss",
  authDomain: "everpulse-app.firebaseapp.com",
  databaseURL: "https://everpulse-app-default-rtdb.firebaseio.com",
  projectId: "everpulse-app",
  storageBucket: "everpulse-app.appspot.com",
  messagingSenderId: "634743701767",
  appId: "1:634743701767:web:ae8caebc95137e963dc5a2",
  measurementId: "G-GBJKCNMDSG",
};

// ✅ Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Firebase Services
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const database = getDatabase(app);
const firestore = getFirestore(app); // ✅ Firestore
const storage = getStorage(app);     // ✅ Storage

export { auth, database, firestore, storage };

