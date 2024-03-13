// ****************** firebase imports
import { getFirestore } from "firebase/firestore";
import app from "./firebaseConfig";

// ****************** Db instance
const db = getFirestore(app);

export default db;