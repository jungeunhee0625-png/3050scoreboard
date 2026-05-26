import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC2hNU8_9KW5Fc7V6QaXvdSKKZnPGktG64",
  authDomain: "scoreboard-917bd.firebaseapp.com",
  projectId: "scoreboard-917bd",
  storageBucket: "scoreboard-917bd.firebasestorage.app",
  messagingSenderId: "739899455343",
  appId: "1:739899455343:web:a6c225c35c287dde2f1a9a",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);