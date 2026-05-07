// ****************** firebase imports
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import auth from "../../firebase/auth";

// ****************** React Hook
import { useState } from "react";

// ****************** React Router
import { Link, useNavigate } from "react-router-dom";
import * as Icon from "react-feather";

// ****************** Components Import
import Loader from "../../components/loader/loader";
import ErrorModal from "../../components/modals/errorModal";

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
    setErrorModal(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError("");
  };

  const registerUser = (e: React.FormEvent) => {
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

    if (!confirmPassword) {
      setIsLoading(false);
      setConfirmPasswordError("Confirm Password is required");
      return false;
    } else if (password !== confirmPassword) {
      setIsLoading(false);
      setConfirmPasswordError("Passwords do not match");
      return false;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setIsLoading(false);
        if (auth.currentUser) {
          sendEmailVerification(auth.currentUser).then(() => {
            navigate("/dashboard");
          });
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        setIsLoading(false);
        setErrorModal(true);
        if (errorCode === "auth/email-already-in-use") {
          setModalMessage("Email is already in use");
        } else if (errorCode === "auth/network-request-failed") {
          setModalMessage("Network error, please try again later");
        } else {
          setModalMessage("An error occurred during sign up");
        }
      });

    return false;
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center relative px-5 py-12">
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

      <div className="glass-card rounded-3xl p-8 md:p-12 w-full max-w-md relative z-10 my-auto">
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl mb-2 text-white">Create Account</h2>
          <p className="text-text-muted">Join Cuttr to start shortening links</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={registerUser}>
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
              autoComplete="new-password"
              className="bg-surface/50 border border-white/10 p-4 rounded-xl text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-text-muted/50"
            />
            {passwordError && <p className="text-red-400 text-xs mt-1 ml-1">{passwordError}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-text-muted ml-1" htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="••••••••"
              autoComplete="new-password"
              className="bg-surface/50 border border-white/10 p-4 rounded-xl text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-text-muted/50"
            />
            {confirmPasswordError && <p className="text-red-400 text-xs mt-1 ml-1">{confirmPasswordError}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 rounded-xl bg-gradient-to-r from-accent to-accent2 font-bold text-white shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? <Loader /> : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-text-muted mt-8">
          Already have an account?{" "}
          <Link to="/signin" className="text-accent font-semibold hover:text-white transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
