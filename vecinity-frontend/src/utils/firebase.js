/*import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBcSRpUQpZl7aeAevDC4ZsaI9IPSoee14w",
  authDomain: "vecinity-65494.firebaseapp.com",
  projectId: "vecinity-65494",
  storageBucket: "vecinity-65494.firebasestorage.app",
  messagingSenderId: "81842340290",
  appId: "1:81842340290:web:58a9ba92bab62b0e76165b",
  measurementId: "G-NLBNMVHVGL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, auth, analytics };
-------------------------------------------------------------------*/
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBcSRpUQpZl7aeAevDC4ZsaI9IPSoee14w",
  authDomain: "vecinity-65494.firebaseapp.com",
  projectId: "vecinity-65494",
  storageBucket: "vecinity-65494.firebasestorage.app",
  messagingSenderId: "81842340290",
  appId: "1:81842340290:web:58a9ba92bab62b0e76165b",
  measurementId: "G-NLBNMVHVGL"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app); // <-- Añade esto

export { app, auth, analytics, db, storage }; // <-- Añade db aquí