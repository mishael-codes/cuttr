import { Link } from "react-router-dom";

const SignIn = () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-evenly">
      <h2 className="font-bold text-text text-3xl relative z-30 after:content-[''] after:absolute after:w-1/4 after:h-[3px] after:bg-accent after:-z-10 after:left-[50%] after:translate-x-[-50%] after:top-8 after:rounded-lg">
        Sign In
      </h2>
      <form className="w-full flex flex-col items-center justify-center">
        <label
          className="flex flex-col mt-4 text-text font-semibold"
          htmlFor="email"
        >
          Email
          <input
            type="email"
            name="password"
            id="email"
            placeholder="johndoe@gmail.com"
            className="bg-transparent border border-accent my-2 p-6 w-80 rounded-lg text-text caret-accent focus:outline-none h-4 placeholder:text-gray-600"
          />
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
            className="bg-transparent border border-accent my-2 p-6 w-80 rounded-lg text-text caret-accent focus:outline-none h-4 placeholder:text-gray-600"
          />
        </label>
        <button className="w-80 rounded-lg bg-accent font-bold text-background p-3 mt-10 border border-accent hover:bg-transparent hover:text-accent transition-all">
          Sign Up
        </button>
      </form>
      <p className="text-text">Don&apos;t have an account? <Link to="/signup" className="text-accent underline underline-offset-2">Sign Up here</Link></p>
    </div>
  );
};

export default SignIn;
