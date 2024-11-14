import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCct5N90e4PQPNLlnmSjavDciazxSI83kU",
  authDomain: "tour-lens.firebaseapp.com",
  projectId: "tour-lens",
  storageBucket: "tour-lens.firebasestorage.app",
  messagingSenderId: "455665426558",
  appId: "1:455665426558:web:822104a10d0c5ab610782f",
  measurementId: "G-ZN0C826V37"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);

export {
  app,
  auth,
};