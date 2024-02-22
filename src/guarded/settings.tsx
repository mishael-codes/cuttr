import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, updateProfile, signOut, deleteUser } from "firebase/auth";

const Settings = () => {
  // get auth instance
  const auth = getAuth();

  // state variable
  const [userName, setUserName] = useState("");

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setUserName(name);
  };

  // update user profile
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

  // sign out user
  const navigate = useNavigate();
  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate("/signin");
    });
  };

  // delete user account
  const handledeleteUser = () => {
    const user = auth.currentUser;
    if (user) {
      deleteUser(user).then(() => {
        navigate("/signup");
      });
    }
  };

  return (
    <div>
      <p>Welcome {auth.currentUser?.displayName}</p>
      <h1>This is the settings page</h1>
      <form onSubmit={handleUpdateProfile}>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Johnie"
          className="h-4 p-6 rounded-lg bg-transparent border border-accent focus:outline-none focus:border-2 mt-2 mr-5"
          onChange={handleChange}
          value={userName}
        />
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
        <button
          onClick={handledeleteUser}
          className="rounded-lg bg-red-700 font-bold text-white p-3 mt-4 border border-red-700 hover:bg-transparent hover:text-red-700 hover:bg-white transition-all"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Settings;
