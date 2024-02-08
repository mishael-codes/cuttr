import { TypeAnimation } from "react-type-animation";

const Hero = () => {
  return (
    <div className="w-screen text-center text-text relative z-0 py-5">
      <div>
        <h1 className="font-bold text-5xl">
          Unleash the Power of <span className="text-accent">Conciseness</span>{" "}
          with <span className="text-accent">Cuttr</span>
        </h1>
        <p className="mt-20 mb-2 px-1 text-2xl">
          Transform long URLs into{" "}
          <TypeAnimation
            sequence={["snappy", 2000, "shareable", 2000, "concise", 2000]}
            wrapper="strong"
            speed={40}
            repeat={Infinity}
            className="text-accent"
          />{" "}
          <br />
          links effortlessly.
        </p>
        <p className="text-lg ">
          <span className="text-accent font-bold">Cuttr</span> - Shorten Your
          Links, Expand Your Reach!
        </p>
      </div>
      <div className="mt-10 w-screen flex items-center justify-center flex-col">
        <input type="url" name="url" id="url" className="w-96 h-4 p-6 rounded-lg backdrop-blur-sm bg-transparent border border-accent focus:outline-none focus:border-2" placeholder="https://www.example.com" />
        <button className="rounded-lg w-96 bg-accent font-bold text-background p-3 mt-4 border border-accent hover:bg-transparent hover:text-accent">Shorten</button>
      </div>
    </div>
  );
};

export default Hero;
