import * as Icon from "react-feather"
import { useState } from "react";
import hamMenu from "../assets/icons/burger-menu.svg";
import closeMenu from "../assets/icons/close.svg";

const Nav = () => {
  const [open, setOpen] = useState(false);
  const links = [
    { name: "Home", url: "/" },
    { name: "Why Cuttr", url: "#whyUs" },
    { name: "FAQs", url: "#faqs" },
  ];

  const showNav = () => {
    !open ? setOpen(true) : setOpen(false);
  };

  return (
    <nav className="w-full flex items-center justify-start md:justify-evenly p-3 shadow-md shadow-accent rounded-lg md:backdrop-blur-sm">
      <h1 className="md:w-[25%] font-bold tracking-tighter text-accent text-4xl h-[50px] px-2 flex items-baseline">
        Cuttr <Icon.Link size="30px" />
      </h1>

      {/* Mobile nav */}
      <div className="md:hidden">
        <div onClick={showNav} className="fixed z-20 right-3 top-1">
          {!open ? <img src={hamMenu} /> : <img src={closeMenu} />}
        </div>
        <div
          className={`bg-[rgba(0,0,0,0.3)] fixed z-10 w-screen h-screen shadow-inset rounded-lg text-2xl text-text flex items-center justify-center flex-col backdrop-blur-sm transition-all ${
            open ? "left-0 top-0" : "left-[100vw] -top-[100vw]"
          }`}
        >
          <ul className="text-center leading-loose">
            {links.map((link) => (
              <li key={link.url}>
                <a onClick={() => {setOpen(!open)}} href={link.url}>{link.name}</a>
              </li>
            ))}
          </ul>
          <div className="buttons flex items-center justify-center flex-col mt-24">
            <button>Sign In</button>
            <button className="rounded-lg bg-accent font-bold text-background p-3 mt-4 border border-accent hover:bg-transparent hover:text-accent transition-all">Sign Up</button>
          </div>
        </div>
      </div>

      {/* desktop nav */}
      <div className="w-[75%] hidden text-text md:flex justify-around items-start text-xl">
        <ul className="text-text text-center flex items-center justify-evenly leading-loose">
          {links.map((link) => (
            <li key={link.url} className="mx-1 px-3">
              <a href={link.url}>{link.name}</a>
            </li>
          ))}
        </ul>
        <div className="buttons flex items-center justify-center leading-loose">
          <button className="mr-2 px-5 rounded-lg bg-transparent font-bold text-accent border border-background hover:bg-accent hover:text-background transition-all">Sign In</button>
          <button className="px-5 rounded-lg bg-accent font-bold text-background border border-accent hover:bg-transparent hover:text-accent transition-all">Sign Up</button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
