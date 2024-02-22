import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import InputLongLink from "../components/shortenInput/input";
const Dashboard = () => {
  const auth = getAuth();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.displayName) {
          setUserName(user.displayName);
        }
      }
    })
  });
  return (
    <div className="flex flex-col items-center mt-7 ml-4">
      <h1 className="self-start md:self-center text-2xl font-bold pl-4">
        Welcome <span className="text-xl">{userName}</span>,
      </h1>
      <InputLongLink text="Shorten a link" />{" "}
    </div>
  );
};

export default Dashboard;
