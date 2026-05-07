// ****************** firebase imports
import auth from "../../firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";

// ****************** React Hooks
import { useState } from "react";

// ****************** React Router
import { Link, useNavigate } from "react-router-dom";
import * as Icon from "react-feather";

// ****************** Components Import
import Loader from "../../components/loader/loader";
import ErrorModal from "../../components/modals/errorModal";

const SignIn: React.FC = () => {
  // State variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
    setErrorModal(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError("");
    setErrorModal(false);
  };

  const signInUser = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email) {
      setIsLoading(false);
      setEmailError("Email is required");
      return false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setIsLoading(false);
      setEmailError("Email is invalid");
      return false;
    }

    if (!password) {
      setIsLoading(false);
      setPasswordError("Password is required");
      return false;
    } else if (password.length < 6) {
      setIsLoading(false);
      setPasswordError("Password must be at least 6 characters");
      return false;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/dashboard");
        setIsLoading(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        setIsLoading(false);
        setErrorModal(true);
        if (errorCode === "auth/invalid-credential") {
          setModalMessage("Invalid login credentials");
        } else if (errorCode === "auth/network-request-failed") {
          setModalMessage("Network error, please try again later");
        } else {
          setModalMessage("An error occurred during sign in");
        }
      });
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center relative px-5">
      {/* Background Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-text-muted hover:text-white transition-colors group">
        <Icon.ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-semibold">Back to Home</span>
      </Link>

      <div className={`absolute top-24 transition-all duration-300 z-50 ${errorModal ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}>
        <ErrorModal error={modalMessage} />
      </div>

      <div className="glass-card rounded-3xl p-8 md:p-12 w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl mb-2 text-white">Welcome Back</h2>
          <p className="text-text-muted">Sign in to manage your links</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={signInUser}>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-text-muted ml-1" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="you@example.com"
              autoComplete="email"
              autoFocus
              className="bg-surface/50 border border-white/10 p-4 rounded-xl text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-text-muted/50"
            />
            {emailError && <p className="text-red-400 text-xs mt-1 ml-1">{emailError}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-text-muted ml-1" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              autoComplete="current-password"
              className="bg-surface/50 border border-white/10 p-4 rounded-xl text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-text-muted/50"
            />
            {passwordError && <p className="text-red-400 text-xs mt-1 ml-1">{passwordError}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 rounded-xl bg-gradient-to-r from-accent to-accent2 font-bold text-white shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? <Loader /> : "Sign In"}
          </button>
        </form>

        <p className="text-center text-text-muted mt-8">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-accent font-semibold hover:text-white transition-colors">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
