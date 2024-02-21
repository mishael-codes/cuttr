import * as Icon from "react-feather";
import { TypeAnimation } from "react-type-animation";
import InputLongLink from "./shortenInput/input";

const Hero = () => {
  return (
    <div className="w-full h-screen text-center text-text relative z-0 pt-14 px-5 flex flex-col items-center">
      <div>
        <h1 className="font-bold text-4xl md:text-5xl md:w-[800px]">
          Unleash the Power of <span className="text-accent">Conciseness</span>{" "}
          with <span className="text-accent">Cuttr</span>
        </h1>
        <p className="mt-10 mb-2 px-1 md:px-0 text-xl">
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
      <InputLongLink text="Get your shortened url now!!"/>
      <div className="my-16 text-accent">
        <a href="#whyUs" className="bounce">
          <Icon.ChevronsDown className="bounce" />
        </a>
      </div>
    </div>
  );
};

export default Hero;
