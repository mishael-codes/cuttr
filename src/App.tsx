import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// pages
import Home from "./pages/home";
import SignUp from "./pages/signup";
import SignIn from "./pages/signin";
import NotFound from "./pages/notfound";
import GuardedRoutes from "./pages/guardedroutes";
import Dashboard from "./pages/guarded/dashboard";
import Settings from "./pages/guarded/settings";
import Redirect from "./components/shortenInput/redirect";

// pure css file
import "./App.css";

function App() {
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
