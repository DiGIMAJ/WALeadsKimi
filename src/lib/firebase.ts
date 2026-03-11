import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBdXqqozqtMEl0vfiieTQGQwQkcb2HwfI8",
  authDomain: "digimajsaas.firebaseapp.com",
  projectId: "digimajsaas",
  storageBucket: "digimajsaas.firebasestorage.app",
  messagingSenderId: "172936131072",
  appId: "1:172936131072:web:55a8f2eb4cffb26c83dee5",
  measurementId: "G-RH55Q75XME"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
