// ****************** firebase imports
import auth from "../firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

// ****************** React Hooks
import { useEffect, useState } from "react";

// ****************** React Router
import { Outlet, useNavigate, NavLink } from "react-router-dom";

// ****************** Icons Imports
import closeMenu from "../assets/icons/close.svg";
import hamMenu from "../assets/icons/burger-menu.svg";

const GuardedRoutes: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("Dashboard");

  const showNav = () => {
    setOpen(!open);
  };

  const links = [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Settings", url: "/settings" },
  ];
  const navigate = useNavigate();
  useEffect(() => {
    if (window.location.pathname === "/settings") {
      setTitle("Settings");
    } else setTitle("Dashboard");

    // ****************** Checks if user is signed in and decides what pages to render based on the the result
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/signin");
      } else {
        window.location.pathname === "/dashboard"
          ? navigate("/dashboard")
          : navigate("/settings");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen text-text flex flex-col md:flex-row">
      {/* mobile Nav */}
      <h1 className="text-accent p-5 font-bold border-b border-accent rounded-lg lg:hidden fixed w-screen backdrop-blur-sm z-40">
        {title}
      </h1>

      <div className="lg:hidden">
        <div onClick={showNav} className="fixed z-50 right-3 top-1">
          {!open ? <img src={hamMenu} /> : <img src={closeMenu} />}
        </div>
        <div
          className={`bg-[rgba(0,0,0,0.3)] fixed z-40 w-screen h-screen shadow-inset rounded-lg text-2xl text-text flex items-center justify-center flex-col backdrop-blur-sm transition-all ${
            open ? "left-0 top-0" : "left-[100vw] -top-[100vw]"
          }`}
        >
          <ul className="text-center leading-loose">
            {links.map((link) => (
              <li key={link.url}>
                <a
                  onClick={() => {
                    setOpen(!open);
                  }}
                  href={link.url}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="hidden w-screen lg:w-64 lg:min-h-screen p-7 px-3 shadow-md shadow-accent rounded-lg lg:flex flex-col fixed bg-background">
        <NavLink
          to="/dashboard"
          className="p-3 font-bold text-text border-b border-accent"
        >
          Dashboard
        </NavLink>
        <NavLink to="/settings" className="p-3 font-bold text-text set ">
          Settings
        </NavLink>
      </div>
      <div className="grow lg:ml-64 pt-10 lg:p-0">
        <Outlet />
      </div>
    </div>
  );
};

export default GuardedRoutes;
