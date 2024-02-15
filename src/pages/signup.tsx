import { Link } from "react-router-dom";
import { useState } from "react";
import Loader from "../components/loader/loader";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
} from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const SignUp = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyB6pHje3a6b_TL5QGVIiZ-9m-73IsjE6cs",
    authDomain: "cuttr-c1515.firebaseapp.com",
    projectId: "cuttr-c1515",
    storageBucket: "cuttr-c1515.appspot.com",
    messagingSenderId: "179583977080",
    appId: "1:179583977080:web:7a52382ef91964690a4f8d",
    measurementId: "G-9RBDMNLCRQ",
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // const analytics = getAnalytics(app);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError("")
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError("")
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const confirmPassword = e.target.value;
    setConfirmPassword(confirmPassword);
    setConfirmPasswordError("")
  };

  const registerUser = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // validating email
    if (!email) {
      setIsLoading(false);
      setEmailError("Email is required")
      return false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setIsLoading(false);
      setEmailError("Email is invalid")
      return false;
    }

    // validating password
    if (!password) {
      setIsLoading(false);
      setPasswordError("Password is required");
      return;
    } else if (password.length < 6) {
      setIsLoading(false)
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    // validating confirm password
    if (!confirmPassword) {
      setIsLoading(false);
      setConfirmPasswordError("Confirm Password  is required");
      return;
    } else if (password !== confirmPassword) {
      setIsLoading(false);
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    const auth = getAuth(app);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        // ...
        console.log(user);
        alert("User signed up successfully");
        setIsLoading(false);
        if (auth.currentUser) {
          sendEmailVerification(auth.currentUser).then(() => {
            // Email verification sent!
            location.href = "/";
          });
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        console.log(errorCode, errorMessage);
      });

    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user.email);
      }
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setIsLoading(false);
    });

    return false;
  };
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-evenly">
      <h2 className="font-bold text-text text-3xl relative z-30 after:content-[''] after:absolute after:w-1/4 after:h-[3px] after:bg-accent after:-z-10 after:left-[50%] after:translate-x-[-50%] after:top-8 after:rounded-lg">
        Sign Up
      </h2>
      <form
        className="w-full flex flex-col items-center justify-center"
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
            className="bg-transparent border border-accent my-2 p-6 w-80 rounded-lg text-text caret-accent focus:outline-none h-4 placeholder:text-gray-600"
          />
          <p className="text-red-500 font-thin text-xs">{emailError ? emailError : ""}</p>
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
            placeholder="********"
            value={password}
            onChange={handlePasswordChange}
            className="bg-transparent border border-accent my-2 p-6 w-80 rounded-lg text-text caret-accent focus:outline-none h-4 placeholder:text-gray-600"
          />
          <p className="text-red-500 font-thin text-xs">{passwordError ? passwordError : ""}</p>
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
            placeholder="********"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="bg-transparent border border-accent my-2 p-6 w-80 rounded-lg text-text caret-accent focus:outline-none h-4 placeholder:text-gray-600"
          />
          <p className="text-red-500 font-thin text-xs">{confirmPasswordError ? confirmPasswordError : ""}</p>
        </label>
        <button
          type="submit"
          className={`relative w-80 h-14 rounded-lg bg-accent font-bold text-background p-3 mt-10 border border-accent hover:bg-transparent hover:text-accent transition-all ${isLoading ? 'cursor-not-allowed bg-transparent' : ''}`}
        >
          {isLoading ? <Loader /> : "Sign Up"}
        </button>
      </form>
      <p className="text-text">
        Already have an account?{" "}
        <Link to="/signin" className="text-accent underline underline-offset-2">
          Sign In here
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
