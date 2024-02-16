import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home"
import SignUp from "./pages/signup"
import SignIn from "./pages/signin";
import NotFound from "./pages/notfound";
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
