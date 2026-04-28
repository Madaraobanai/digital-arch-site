import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, onValue, serverTimestamp, query, limitToLast } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAb1qfJ1UMQJXuPRQTSlMyjUIpanUJCouY",
  authDomain: "bypass-8968d.firebaseapp.com",
  databaseURL: "https://bypass-8968d-default-rtdb.firebaseio.com",
  projectId: "bypass-8968d",
  storageBucket: "bypass-8968d.firebasestorage.app",
  messagingSenderId: "568360120676",
  appId: "1:568360120676:web:954a00c998c9956badca71"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export { ref, push, set, onValue, serverTimestamp, query, limitToLast };
