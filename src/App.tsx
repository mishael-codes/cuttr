import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// pages
import Home from "./pages/home";
import SignUp from "./pages/signup";
import SignIn from "./pages/signin";
import NotFound from "./pages/notfound";
import GuardedRoutes from "./pages/guardedroutes";
import Dashboard from "./guarded/dashboard";
import Settings from "./guarded/settings";
import Redirect from "./components/shortenInput/redirect";

// pure css file
import "./App.css";

// firebase imports
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// react hooks import
import { useEffect } from "react";

function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyB6pHje3a6b_TL5QGVIiZ-9m-73IsjE6cs",
    authDomain: "cuttr-c1515.firebaseapp.com",
    projectId: "cuttr-c1515",
    storageBucket: "cuttr-c1515.appspot.com",
    messagingSenderId: "179583977080",
    appId: "1:179583977080:web:7a52382ef91964690a4f8d",
    measurementId: "G-9RBDMNLCRQ",
  };

  // initialize firebase app
  const app = initializeApp(firebaseConfig);

  // firestore instance
  const db = getFirestore(app);

  // collection reference
  const colRef = collection(db, "urls");

  // get all documents from the collection
  getDocs(colRef)
    .then((querySnapshot) => {
      const urls: Array<object> = [];
      querySnapshot.docs.forEach((doc) => {
        urls.push({ ...doc.data(), id: doc.id});
      });
      console.log(urls);
    })
    .catch((error) => {
      console.log(error);
    });

  // auth instance
  const auth = getAuth(app);

  // checking if user is signed in
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.log("User is not signed in");
      } else {
        // const uid = user.uid;
        console.log("User is signed in");
      }
    });
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="signin" element={<SignIn />} />
        <Route element={<GuardedRoutes />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/:slug" element={<Redirect />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
