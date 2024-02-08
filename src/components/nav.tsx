import { useState } from "react";
import hamMenu from "../assets/icons/burger-menu.svg";
import closeMenu from "../assets/icons/close.svg";

const Nav = () => {
  const [open, setOpen] = useState(false);
  const links = [
    { name: "Home", url: "/" },
    { name: "Why Cuttr", url: "/whyUs" },
    { name: "Pricing", url: "/pricing" },
    { name: "FAQs", url: "/faqs" },
  ];

  const showNav = () => {
    !open ? setOpen(true) : setOpen(false);
  };

  return (
    <nav className="sticky w-screen z-20 top-0 left-0 flex items-center justify-start md:justify-evenly p-3 shadow-inset rounded-lg backdrop-blur-sm">
      <h1 className="font-bold tracking-tighter text-accent text-4xl h-[50px] px-2">
        Cuttr
      </h1>

      {/* Mobile nav */}
      <div className="md:hidden">
        <div onClick={showNav} className="fixed z-20 right-3 top-1">
          {!open ? <img src={hamMenu} /> : <img src={closeMenu} />}
        </div>
        <div
          className={`fixed z-10 w-screen h-screen shadow-inset rounded-lg text-2xl text-text flex items-center justify-center flex-col backdrop-blur-lg transition-all ${
            open ? "left-0 top-0" : "left-[100vw] -top-[100vw]"
          }`}
        >
          <ul className="text-center leading-loose">
            {links.map((link) => (
              <li key={link.url}>
                <a href={link.url}>{link.name}</a>
              </li>
            ))}
          </ul>
          <div className="buttons flex items-center justify-center flex-col mt-24">
            <button>Login</button>
            <button>Sign Up</button>
          </div>
        </div>
      </div>


      {/* desktop nav */}
      <div className="hidden text-text md:flex justify-around items-start w-[55%] text-xl">
        <ul className="text-text text-center flex items-center justify-evenly leading-loose">
          {links.map((link) => (
            <li key={link.url} className="mx-1 px-3">
              <a href={link.url}>{link.name}</a>
            </li>
          ))}
        </ul>
        <div className="buttons flex items-center justify-center leading-loose">
          <button className="mx-5 px-5">Login</button>
          <button className="px-5">Sign Up</button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
