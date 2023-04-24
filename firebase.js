import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
	apiKey: "AIzaSyBlhICECE_x5x98aSCKANbRLLe1PeZyt7I",
	authDomain: "laundry-express-772b6.firebaseapp.com",
	databaseURL: "https://laundry-express-772b6-default-rtdb.firebaseio.com",
	projectId: "laundry-express-772b6",
	storageBucket: "laundry-express-772b6.appspot.com",
	messagingSenderId: "387025383263",
	appId: "1:387025383263:web:03facc6e1854f44c76d0ea",
	measurementId: "G-D09XDZP20N",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore();

export { auth, db };
