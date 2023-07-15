// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3Yp5ZSIATCR-GCGK_onoS0h8-drNPl00",
  authDomain: "dateplanner-391920.firebaseapp.com",
  projectId: "dateplanner-391920",
  storageBucket: "dateplanner-391920.appspot.com",
  messagingSenderId: "138188008135",
  appId: "1:138188008135:web:4ff83cecdfdcbdb7882ce2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/cloud-platform');

export {auth, provider};