// ****************** React Feather
import * as Icon from "react-feather";

// ****************** NPM Imports
import { TypeAnimation } from "react-type-animation";

// ******************Component Imports
import InputLongLink from "../shortenInput/input";

const Hero: React.FC = () => {
  return (
    <div className="hero w-full min-h-screen relative flex flex-col items-center justify-center pt-24 pb-12 px-5 overflow-hidden">
      {/* Animated Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <div className="z-10 text-center flex flex-col items-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-6 animate-float">
          Unleash the Power of <br className="hidden md:block" />
          <span className="text-gradient">Conciseness</span> with <span className="text-gradient">Cuttr</span>
        </h1>
        
        <p className="mt-6 mb-8 px-4 md:px-0 text-xl md:text-2xl text-text-muted font-light max-w-2xl mx-auto">
          Transform long URLs into{" "}
          <TypeAnimation
            sequence={["snappy", 2000, "shareable", 2000, "concise", 2000]}
            wrapper="strong"
            speed={40}
            repeat={Infinity}
            className="text-white font-semibold"
          />{" "}
          links effortlessly. <br className="hidden md:block" />
          Shorten Your Links, Expand Your Reach!
        </p>

        <div className="w-full max-w-2xl mt-8 glass-card rounded-2xl p-6 md:p-8 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent to-accent2 rounded-2xl blur opacity-20"></div>
          <InputLongLink text="Get your shortened url now!!" />
        </div>

        <div className="mt-20 text-text-muted hover:text-white transition-colors duration-300">
          <a href="#whyUs" className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-sm font-medium tracking-wider uppercase">Discover More</span>
            <Icon.ChevronDown className="w-6 h-6" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
