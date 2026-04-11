import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD-c9SFQJje7129x_olP3t1BELikKYJWeI",
  authDomain: "estatistica-dos-cultos.firebaseapp.com",
  databaseURL: "https://estatistica-dos-cultos-default-rtdb.firebaseio.com",
  projectId: "estatistica-dos-cultos",
  storageBucket: "estatistica-dos-cultos.firebasestorage.app",
  messagingSenderId: "254075824976",
  appId: "1:254075824976:web:14b263efb77f293212da55"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
