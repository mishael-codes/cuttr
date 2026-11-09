// ****************** firebase imports
import auth from "../firebase/auth";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

// ****************** React Hooks
import { useEffect, useState } from "react";

// ****************** React Router
import { Outlet, useNavigate, NavLink, useLocation, Link } from "react-router-dom";

// ****************** React Feather
import * as Icon from "react-feather";

const GuardedRoutes: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/signin");
      } else {
        setCurrentUser(user);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Close mobile nav on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/signin");
    } catch (err) {
      console.error(err);
    }
  };

  const navItems = [
    { name: "Dashboard", url: "/dashboard", icon: Icon.Layout },
    { name: "Settings", url: "/settings", icon: Icon.Settings },
  ];

  const currentTitle = location.pathname.includes("settings") ? "Settings" : "Dashboard";
  const userInitials = (currentUser?.displayName || currentUser?.email || "U")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background text-text flex flex-col lg:flex-row antialiased">
      {/* ================= Mobile Top Bar (< lg) ================= */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-surface/90 backdrop-blur-md border-b border-white/10 z-40 px-4 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent to-accent2 flex items-center justify-center text-black font-display font-extrabold text-base shadow-sm">
            C
          </div>
          <span className="font-display font-bold text-lg text-white">
            Cuttr<span className="text-accent">.</span>
          </span>
          <span className="text-xs text-text-muted/60 ml-1">/ {currentTitle}</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation menu"
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-accent/40 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50"
          >
            {open ? <Icon.X size={20} /> : <Icon.Menu size={20} />}
          </button>
        </div>
      </header>

      {/* ================= Mobile Drawer Backdrop & Menu (< lg) ================= */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/75 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      <aside
        className={`lg:hidden fixed top-0 right-0 bottom-0 w-72 max-w-[85vw] bg-surface border-l border-white/10 z-50 flex flex-col justify-between p-6 shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent to-accent2 flex items-center justify-center text-black font-display font-black text-lg">
                C
              </div>
              <div>
                <span className="font-display font-bold text-lg text-white">Cuttr</span>
                <p className="text-[11px] text-text-muted">Link Management</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors"
            >
              <Icon.X size={20} />
            </button>
          </div>

          {/* User badge */}
          <div className="my-6 p-3 rounded-xl bg-surface-light border border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-semibold text-sm">
              {userInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">
                {currentUser?.displayName || "Cuttr User"}
              </p>
              <p className="text-xs text-text-muted truncate">
                {currentUser?.email || ""}
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            <p className="px-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">
              Menu
            </p>
            {navItems.map((item) => {
              const ItemIcon = item.icon;
              return (
                <NavLink
                  key={item.url}
                  to={item.url}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-accent/15 text-accent border border-accent/30 font-semibold"
                        : "text-text-muted hover:text-white hover:bg-white/5"
                    }`
                  }
                >
                  <ItemIcon size={18} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-text-muted hover:text-white hover:bg-white/5 transition-colors"
            >
              <Icon.Globe size={18} />
              <span>Public Site</span>
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 text-sm font-medium transition-colors"
          >
            <Icon.LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ================= Desktop Fixed Sidebar (>= lg) ================= */}
      <aside className="hidden lg:flex w-64 fixed top-0 bottom-0 left-0 bg-surface/70 backdrop-blur-xl border-r border-white/10 flex-col justify-between p-6 z-30">
        <div>
          {/* Brand */}
          <Link to="/dashboard" className="flex items-center gap-3 px-2 py-1 mb-8 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent to-accent2 flex items-center justify-center text-black font-display font-extrabold text-xl shadow-lg shadow-accent/20 group-hover:scale-105 transition-transform">
              C
            </div>
            <div>
              <span className="font-display font-extrabold text-xl text-white tracking-tight">
                Cuttr<span className="text-accent">.</span>
              </span>
              <p className="text-[11px] text-text-muted font-medium">Link Management</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="space-y-1.5">
            <p className="px-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">
              Workspace
            </p>
            {navItems.map((item) => {
              const ItemIcon = item.icon;
              return (
                <NavLink
                  key={item.url}
                  to={item.url}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-accent/15 text-accent border border-accent/30 font-semibold shadow-sm"
                        : "text-text-muted hover:text-white hover:bg-white/5"
                    }`
                  }
                >
                  <ItemIcon size={18} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}

            <div className="pt-4 mt-4 border-t border-white/5">
              <Link
                to="/"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:text-white hover:bg-white/5 transition-colors"
              >
                <Icon.Globe size={18} />
                <span>Cuttr Landing</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* User Card & Sign Out */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="p-3 rounded-xl bg-surface-light/80 border border-white/5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-semibold text-sm shrink-0">
                {userInitials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate" title={currentUser?.displayName || "User"}>
                  {currentUser?.displayName || "Cuttr User"}
                </p>
                <p className="text-[11px] text-text-muted truncate" title={currentUser?.email || ""}>
                  {currentUser?.email || "Signed In"}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Icon.LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ================= Main Viewport Area ================= */}
      <main className="grow lg:ml-64 w-full min-h-screen pt-16 lg:pt-0 pb-16 flex flex-col">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 lg:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default GuardedRoutes;
