// ****************** firebase imports
import auth from "../../firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";

// ****************** React Hooks
import { useState } from "react";

// ****************** React Router
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// ****************** Components Import
import Loader from "../../components/loader/loader";
import ErrorModal from "../../components/modals/errorModal";
import LinkIconAnimation from "../../components/animations/linkIcon";

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
  // ****************** Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError("");
    setErrorModal(false);
  };

  // ****************** Handle password input change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError("");
    setErrorModal(false);
  };

  // ****************** Sign in user
  const signInUser = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // ****************** Validating email
    if (!email) {
      setIsLoading(false);
      setEmailError("Email is required");
      return false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setIsLoading(false);
      setEmailError("Email is invalid");
      return false;
    }

    // ****************** Validating password
    if (!password) {
      setIsLoading(false);
      setPasswordError("Password is required");
      return false;
    } else if (password.length < 6) {
      setIsLoading(false);
      setPasswordError("Password must be at least 6 characters");
      return false;
    }

    // ****************** If all checks proceed to sign in user
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        navigate("/dashboard");
        user;
        setIsLoading(false);
      })
      .catch((error) => {
        // ****************** Error Handling
        const errorCode = error.code;

        if (errorCode === "auth/invalid-credential") {
          setIsLoading(false);
          setErrorModal(true);
          setModalMessage("Invalid login credentials");
        } else if (errorCode === "auth/network-request-failed") {
          setIsLoading(false);
          setErrorModal(true);
          setModalMessage("Network error, please try again later");
        }
      });
  };

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-evenly relative">
      <LinkIconAnimation index="-z-0" marginTop="mt-[15vh]"/>
      <div className={`absolute transition-all ${errorModal ? "top-32 md:top-36" : "-top-36"}`}>{errorModal ? <ErrorModal error={modalMessage} /> : ""}</div>
      <h2 className="font-bold text-text text-3xl relative z-30 after:content-[''] after:absolute after:w-1/4 after:h-[3px] after:bg-accent after:-z-10 after:left-[50%] after:translate-x-[-50%] after:top-8 after:rounded-lg">
        Sign In
      </h2>
      <form
        className="w-full flex flex-col items-center justify-center"
        onSubmit={signInUser}
      >
        <label
          className="flex flex-col mt-4 text-text font-semibold"
          htmlFor="email"
        >
          Email
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="johndoe@gmail.com"
            autoComplete="email"
            autoFocus
            className="bg-background opacity-80 border border-accent my-2 p-6 w-80 rounded-lg text-text caret-accent focus:outline-none h-4 placeholder:text-gray-600"
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
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
            autoComplete="current-password"
            className="bg-background opacity-80 border border-accent my-2 p-6 w-80 rounded-lg text-text caret-accent focus:outline-none h-4 placeholder:text-gray-600"
          />
          <p className="text-red-500 font-thin text-xs">
            {passwordError ? passwordError : ""}
          </p>
        </label>
        <button
          type="submit"
          className={`relative w-80 h-14 rounded-lg bg-accent font-bold text-background p-3 mt-10 border border-accent hover:bg-transparent hover:text-accent transition-all ${
            isLoading ? "cursor-not-allowed bg-transparent" : ""
          }`}
        >
          {isLoading ? <Loader /> : "Sign In"}
        </button>
      </form>
      <p className="text-text z-20">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="text-accent underline underline-offset-2">
          Sign Up here
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
