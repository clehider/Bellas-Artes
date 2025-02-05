import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB08Ss_5HwpRWU2Ag2k3Nxc2JgIutrXqDg",
  authDomain: "institutogestion-80e6b.firebaseapp.com",
  projectId: "institutogestion-80e6b",
  storageBucket: "institutogestion-80e6b.appspot.com",
  messagingSenderId: "730912881952",
  appId: "1:730912881952:web:504dadab578ed8afef6b45"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
export default app;
