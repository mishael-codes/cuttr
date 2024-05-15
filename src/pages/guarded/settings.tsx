// ****************** firebase imports
import {
  updateProfile,
  signOut,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import auth from "../../firebase/auth";

// ****************** React Hooks
import { useState } from "react";

// ****************** React Router
import { useNavigate } from "react-router-dom";

// ****************** Component Import
import Offline from "../../components/offline";

const Settings: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [authenticate, setAuthenticate] = useState("");

  // ****************** get current user
  const user = auth.currentUser;

  // ****************** handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setUserName(name);
  };

  // ****************** update user profile
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();

    if (user) {
      updateProfile(user, {
        displayName: userName,
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
      navigate("/");
    });
  };

  // ****************** delete user account

  const authenticatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPassword = e.target.value;
    setAuthenticate(confirmPassword);
  };

  const showDeleteModal = () => {
    setDeleteModal(true);
  };

  const handleDeleteUser = async (password: string) => {
    const userEmail = user?.email ? user?.email : "";
    if (user) {
      const credential = EmailAuthProvider.credential(userEmail, password);
      try {
        await reauthenticateWithCredential(user, credential);
        await deleteUser(user).then(() => {
          navigate("/");
        });
      } catch (error) {
        console.error(error);
      }
    }
  };
  return navigator.onLine ? (
    <>
      <h1 className="ps-4 pt-2">Welcome {auth.currentUser?.displayName},</h1>
      <form onSubmit={handleUpdateProfile} className="ps-8 pt-4">
        <label htmlFor="username" className="flex flex-col mb-5">
          Update your username
          <input
            type="text"
            name="username"
            id="username"
            placeholder={user?.displayName ? user?.displayName : "Johnie"}
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
            placeholder={user?.email ? user?.email : "johndoe@gmail.com"}
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

      <div className="w-[80%] flex items-center justify-evenly absolute bottom-10">
        <button
          onClick={handleSignOut}
          data-testid="signout"
          className="rounded-lg bg-accent font-bold text-background p-3 mt-4 border border-accent hover:bg-transparent hover:text-accent transition-all"
        >
          Sign Out
        </button>
        <button
          onClick={showDeleteModal}
          className="rounded-lg bg-red-700 font-bold text-white p-3 mt-4 border border-red-700 hover:bg-transparent hover:text-red-700 hover:bg-white transition-all"
        >
          Delete Account
        </button>
      </div>

      {!deleteModal ? (
        <div className="h-fit absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 bg-background p-6 rounded-lg flex items-center justify-evenly flex-col shadow-md shadow-accent">
          <p className=" font-bold text-accent">You&apos;re leaving?</p>
          <p>Are you sure you want to go?</p>
          <form className="flex flex-col">
            <input
              type="password"
              onChange={authenticatePassword}
              className="h-3 w-72 p-6 rounded-lg bg-transparent border border-accent focus:outline-none focus:border-2 mt-2"
            />
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handleDeleteUser(authenticate);
              }}
              className="rounded-lg bg-accent font-bold text-background p-3 mt-4 border border-accent hover:bg-transparent hover:text-accent transition-all"
            >
              Yes, delete
            </button>
          </form>
        </div>
      ) : (
        ""
      )}
    </>
  ) : (
    <Offline />
  );
};

export default Settings;
