// ****************** firebase imports
import { getAuth } from "firebase/auth";
import app from "./firebaseConfig";

// ****************** Auth Instance
const auth = getAuth(app);

export default auth;
