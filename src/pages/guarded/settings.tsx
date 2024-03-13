// ****************** firebase imports
import { updateProfile, signOut } from "firebase/auth";
import auth from "../../firebase/auth";

// ****************** React Hooks
import { useState } from "react";

// ****************** React Router
import { useNavigate } from "react-router-dom";

// ****************** Component Import
import Offline from "../../components/offline";

const Settings: React.FC = () => {
  const [userName, setUserName] = useState("");

  // ****************** handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setUserName(name);
  };

  // ****************** update user profile
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (user) {
      updateProfile(user, {
        displayName: userName,
        photoURL: "",
      })
        .then(() => {
          navigate("/settings");
        })
        .catch((error) => {
          console.log(error.code);
        });
    }
  };

  // ****************** sign out user
  const navigate = useNavigate();
  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate("/signin");
    });
  };

  // delete user account
  /* const handledeleteUser = () => {
    const user = auth.currentUser;
    if (user) {
      deleteUser(user).then(() => {
        navigate("/signup");
      });
    }
  }; */

  return (
    navigator.onLine ? <div>
    <h1 className="ps-4 pt-2">Welcome {auth.currentUser?.displayName},</h1>
    <form onSubmit={handleUpdateProfile} className="ps-8 pt-4">
      <label htmlFor="username" className="flex flex-col mb-5">
        Update your username
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Johnie"
          className="h-4 w-72 p-6 rounded-lg bg-transparent border border-accent focus:outline-none focus:border-2 mt-2 mr-5"
          onChange={handleChange}
        />
      </label>
      <label htmlFor="email" className="flex flex-col mb-5">
        Update your email
        <input
          type="text"
          name="email"
          id="email"
          placeholder="johndoe@gmail.com"
          className="h-4 w-72 p-6 rounded-lg bg-transparent border border-accent focus:outline-none focus:border-2 mt-2 mr-5 cursor-not-allowed"
          onChange={handleChange}
          disabled
        />
      </label>
      <label htmlFor="password" className="flex flex-col mb-5">
        Reset your password
        <input
          type="text"
          name="password"
          id="password"
          placeholder="******"
          className="h-4 w-72 p-6 rounded-lg bg-transparent border border-accent focus:outline-none focus:border-2 mt-2 mr-5 cursor-not-allowed"
          onChange={handleChange}
          disabled
        />
      </label>
      <button className="rounded-lg bg-accent font-bold text-background p-3 mt-4 border border-accent hover:bg-transparent hover:text-accent transition-all">
        Save
      </button>
    </form>

    <div className="w-screen flex items-center justify-center flex-col absolute bottom-10">
      <button
        onClick={handleSignOut}
        className="rounded-lg bg-accent font-bold text-background p-3 mt-4 border border-accent hover:bg-transparent hover:text-accent transition-all"
      >
        Sign Out
      </button>
      {/* <button
        onClick={handledeleteUser}
        className="rounded-lg bg-red-700 font-bold text-white p-3 mt-4 border border-red-700 hover:bg-transparent hover:text-red-700 hover:bg-white transition-all"
      >
        Delete Account
      </button> */}
    </div>
  </div> : <Offline/>
  );
};

export default Settings;
