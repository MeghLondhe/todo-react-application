import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCaoHyOBsu8WzUFCDuAXvPRB0iWdnZe128",
  authDomain: "to-do-react-c20c5.firebaseapp.com",
  projectId: "to-do-react-c20c5",
  storageBucket: "to-do-react-c20c5.appspot.com",
  messagingSenderId: "500386569553",
  appId: "1:500386569553:web:b2ce72bc67ffdee6b14770",
  measurementId: "G-RD3RBC5488"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
export { db }