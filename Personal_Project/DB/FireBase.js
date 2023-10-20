import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAUoOgEdqAJjl2MbnqQiztR-8Et2_vFQMA",
  authDomain: "invest-dc713.firebaseapp.com",
  projectId: "invest-dc713",
  storageBucket: "invest-dc713.appspot.com",
  messagingSenderId: "444502692151",
  appId: "1:444502692151:web:9c944901c77ca1655c4ab2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
