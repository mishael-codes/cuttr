import { Outlet, useNavigate } from "react-router-dom";
// import useAuth from "../hooks/useAuth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

const GuardedRoutes = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/signin");
      } else {
        navigate("/dashboard");
      }
    });
  });
  return (
    <div className="h-screen text-text flex flex-col">
      <div className="w-screen md:w-[25%] p-7 px-3 shadow-md shadow-accent rounded-lg mb-5">
        <h1 className="font-bold text-accent ">Dashboard</h1>
      </div>
      <div className="grow">
        <Outlet />
      </div>
    </div>
  );
};

export default GuardedRoutes;
