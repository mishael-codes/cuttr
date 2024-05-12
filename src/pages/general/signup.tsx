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

// ****************** Components Import
import Loader from "../../components/loader/loader";
import LinkIconAnimation from "../../components/animations/linkIcon";
import ErrorModal from "../../components/modals/errorModal";
// import { getAnalytics } from "firebase/analytics";

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

  // ****************** Checks for changes in the email input field
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError("");
    setErrorModal(false);
  };

  // ****************** Checks for changes in the password input field
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError("");
  };

  // ****************** Checks for changes in the confirm pasword input field
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const confirmPassword = e.target.value;
    setConfirmPassword(confirmPassword);
    setConfirmPasswordError("");
  };

  // ****************** Function to register new user
  const registerUser = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // ****************** validating email
    if (!email) {
      setIsLoading(false);
      setEmailError("Email is required");
      return false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setIsLoading(false);
      setEmailError("Email is invalid");
      return false;
    }

    // ****************** validating password
    if (!password) {
      setIsLoading(false);
      setPasswordError("Password is required");
      return;
    } else if (password.length < 6) {
      setIsLoading(false);
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    // ****************** validating confirm password
    if (!confirmPassword) {
      setIsLoading(false);
      setConfirmPasswordError("Confirm Password  is required");
      return;
    } else if (password !== confirmPassword) {
      setIsLoading(false);
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    // ****************** If all checks, create user
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        user
        setIsLoading(false);
        // ****************** Sends the user a verification email when the user's account is created
        if (auth.currentUser) {
          sendEmailVerification(auth.currentUser).then(() => {
            // ****************** After email verification sent!
            navigate("/dashboard");
          });
        }
      })
      .catch((error) => {
        // ****************** Checks for any error
        const errorCode = error.code;
        if (errorCode === "auth/email-already-in-use") {
          setIsLoading(false);
          setErrorModal(true);
          setModalMessage("Email is already in use");
        } else if (errorCode === "auth/network-request-failed") {
          setIsLoading(false);
          setErrorModal(true);
          setModalMessage("Network error, please try again later");
        }
      });

    return false;
  };
  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-evenly relative overflow-hidden">
      <LinkIconAnimation index="-z-0" marginTop="mt-[15vh]" />
      <div className={`absolute transition-all ${errorModal ? "top-[5.65rem] md:top-24" : "-top-36"}`}>{errorModal ? <ErrorModal error={modalMessage} /> : ""}</div>
      <h2 className="font-bold text-text text-3xl relative z-30 after:content-[''] after:absolute after:w-1/4 after:h-[3px] after:bg-accent after:-z-10 after:left-[50%] after:translate-x-[-50%] after:top-8 after:rounded-lg">
        Sign Up
      </h2>
      <form
        className="w-full flex flex-col items-center justify-center relative"
        onSubmit={registerUser}
      >
        <label
          className="flex flex-col mt-4 text-text font-semibold"
          htmlFor="email"
        >
          Email
          <input
            type="email"
            name="password"
            id="email"
            value={email}
            placeholder="johndoe@gmail.com"
            onChange={handleEmailChange}
            autoComplete="email"
            autoFocus
            className="bg-background opacity-60 border border-accent my-2 p-6 w-80 rounded-lg text-text caret-accent focus:outline-none h-4 placeholder:text-gray-600"
          />
          <p className="text-red-500 font-thin text-xs">
            {emailError ? emailError : ""}
          </p>
        </label>
        <label
          className="flex flex-col mt-4 text-text font-semibold"
          htmlFor="password"
        >
          Password
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            autoComplete="current-password"
            className="bg-background opacity-80 border border-accent my-2 p-6 w-80 rounded-lg text-text caret-accent focus:outline-none h-4 placeholder:text-gray-600"
          />
          <p className="text-red-500 font-thin text-xs">
            {passwordError ? passwordError : ""}
          </p>
        </label>

        <label
          className="flex flex-col mt-4 text-text font-semibold"
          htmlFor="confirmPassword"
        >
          Confirm Password
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Re-enter Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            autoComplete="current-password"
            className="bg-background opacity-80 border border-accent my-2 p-6 w-80 rounded-lg text-text caret-accent focus:outline-none h-4 placeholder:text-gray-600"
          />
          <p className="text-red-500 font-thin text-xs">
            {confirmPasswordError ? confirmPasswordError : ""}
          </p>
        </label>
        <button
          type="submit"
          className={`relative w-80 h-14 rounded-lg bg-accent font-bold text-background p-3 mt-10 border border-accent hover:bg-transparent hover:text-accent transition-all ${
            isLoading ? "cursor-not-allowed bg-transparent" : ""
          }`}
        >
          {isLoading ? <Loader /> : "Sign Up"}
        </button>
      </form>
      <p className="text-text relative z-10">
        Already have an account?{" "}
        <Link to="/signin" className="text-accent underline underline-offset-2">
          Sign In here
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
