import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBLHVcg8VIkkM07MXJeFoqEHeXjLI4dQKA",
    authDomain: "custom-charts-clone.firebaseapp.com",
    projectId: "custom-charts-clone",
    storageBucket: "custom-charts-clone.appspot.com",
    messagingSenderId: "56704129105",
    appId: "1:56704129105:web:5f92ba9ca08b8ee3418070",
    measurementId: "G-3NB9G583X1"
  };
const firebaseApp=firebase.initializeApp(firebaseConfig);
const db=firebaseApp.firestore();
const auth=firebase.auth();

export {db,auth};
