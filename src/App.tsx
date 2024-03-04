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
import { onAuthStateChanged } from "firebase/auth";
import auth from "./firebase/auth";

// react hooks import
import { useEffect } from "react";

function App() {
  // checking if user is signed in
  useEffect(() => {
    if (navigator.onLine) {
      onAuthStateChanged(auth, (user) => {
        if (!user) {
          console.log("User is not signed in");
        } else {
          // const uid = user.uid;
          console.log("User is signed in");
        }
      });
    } else console.log("You are offline");
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
