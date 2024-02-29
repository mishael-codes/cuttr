import { Outlet, useNavigate, NavLink } from "react-router-dom";
// import useAuth from "../hooks/useAuth";
import { onAuthStateChanged } from "firebase/auth";
import auth from "../firebase/auth";
import { useEffect, useState } from "react";
import hamMenu from "../assets/icons/burger-menu.svg";
import closeMenu from "../assets/icons/close.svg";

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
    <div className="h-screen text-text flex flex-col md:flex-row">
      <h1 className="text-accent p-5 font-bold border-b border-accent rounded-lg md:hidden">
        {title}
      </h1>
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

      <div className="hidden w-screen md:w-[20%] md:h-screen p-7 px-3 shadow-md shadow-accent rounded-lg mb-5 md:flex flex-col">
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
      <div className="grow">
        <Outlet />
      </div>
    </div>
  );
};

export default GuardedRoutes;
