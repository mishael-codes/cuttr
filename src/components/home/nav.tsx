// ************ firebase imports
import auth from "../../firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

// ************ React feather
import * as Icon from "react-feather";

// ************ React Hooks
import { useState, useEffect } from "react";

// ************ React Router Dom
import { Link } from "react-router-dom";

// ************ Icon Imports
import closeMenu from "../../assets/icons/close.svg";
import hamMenu from "../../assets/icons/burger-menu.svg";

const Nav: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { name: "Home", url: "/" },
    { name: "Why Cuttr", url: "#whyUs" },
    { name: "Pricing", url: "#pricing" },
    { name: "FAQs", url: "#faqs" },
  ];

  const showNav = () => {
    setOpen(!open);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsUser(!!user);
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-3 shadow-glass' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-display font-bold tracking-tight text-3xl text-gradient">Cuttr</span>
          <Icon.Link className="text-accent group-hover:rotate-12 transition-transform duration-300" size={28} />
        </Link>

        {/* Mobile Menu Button */}
        <button onClick={showNav} className="lg:hidden z-50 p-2 rounded-lg bg-surface-light border border-white/10">
          {!open ? <Icon.Menu className="text-accent" /> : <Icon.X className="text-accent" />}
        </button>

        {/* Mobile Overlay */}
        <div className={`lg:hidden fixed inset-0 bg-background/95 backdrop-blur-xl z-40 transition-transform duration-500 flex flex-col items-center justify-center ${open ? "translate-x-0" : "translate-x-full"}`}>
          <ul className="text-center space-y-8 text-2xl font-display font-medium text-text">
            {links.map((link) => (
              <li key={link.url}>
                <a onClick={showNav} href={link.url} className="hover:text-accent transition-colors">
                  {link.name}
                </a>
              </li>
            ))}
            {isUser && (
              <>
                <li><Link to="/dashboard" onClick={showNav} className="hover:text-accent transition-colors">Dashboard</Link></li>
                <li><Link to="/settings" onClick={showNav} className="hover:text-accent transition-colors">Settings</Link></li>
              </>
            )}
          </ul>
          
          {!isUser && (
            <div className="flex flex-col gap-4 mt-12 w-3/4 max-w-xs">
              <Link to="/signin" onClick={showNav} className="w-full py-3 text-center rounded-xl bg-surface border border-white/10 font-semibold hover:bg-surface-light transition-all">
                Sign In
              </Link>
              <Link to="/signup" onClick={showNav} className="w-full py-3 text-center rounded-xl bg-gradient-to-r from-accent to-accent2 text-white font-semibold shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-6 font-medium text-text-muted">
            {links.map((link) => (
              <li key={link.url}>
                <a href={link.url} className="hover:text-white transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-accent hover:after:w-full after:transition-all after:duration-300">
                  {link.name}
                </a>
              </li>
            ))}
            {isUser && (
              <>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/settings" className="hover:text-white transition-colors">Settings</Link></li>
              </>
            )}
          </ul>

          {!isUser && (
            <div className="flex items-center gap-4">
              <Link to="/signin" className="px-5 py-2.5 rounded-xl font-semibold text-text hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent2 text-white font-semibold shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5 transition-all duration-300">
                Sign Up
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Nav;
