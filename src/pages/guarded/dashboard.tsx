// ********************** firebase imports
import auth from "../../firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import db from "../../firebase/firestore";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// ******************** React Hooks
import { useEffect, useState } from "react";

// ******************** React Feather
import * as Icon from "react-feather";

// ******************** Components imports
import Offline from "../../components/offline";
import Truncate from "../../components/dashboard/truncate";
import InputLongLink from "../../components/shortenInput/input";
import SuccessModal from "../../components/modals/successModal";

const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [successModal, setSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [arr, setArr] = useState<
    Array<{
      id: string;
      url: string;
      shortLink: string;
      qrCodeData: string;
      timesClicked: number;
      editUrls: boolean;
      deleteConfirm: boolean;
      linkName: string;
    }>
  >([]);

  const user = auth.currentUser;
  const userId = user?.uid;

  //*******************************  trigger edit mode for urls
  const handleEditUrls = (id: string) => {
    setArr((prevArr) => {
      return prevArr.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            editUrls: true,
            deleteConfirm: false,
          };
        }
        return item;
      });
    });
  };

  //*********************************  cancel edit mode for urls
  const handleCancelEditUrls = (id: string) => {
    setArr((prevArr) => {
      return prevArr.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            editUrls: false,
          };
        }
        return item;
      });
    });
  };

  const handleDeleteConfirm = (id: string) => {
    setArr((prevArr) => {
      return prevArr.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            deleteConfirm: true,
            editUrls: false,
          };
        }
        return item;
      });
    });
  };

  const handleCancelDelete = (id: string) => {
    setArr((prevArr) => {
      return prevArr.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            deleteConfirm: false,
          };
        }
        return item;
      });
    });
  };

  //********************************* delete created urls
  const handleDeleteUrls = async (id: string) => {
    const colRef = doc(db, "urls", id);
    const docRef = userId
      ? doc(db, "user-collection", userId, "slug", id)
      : null;
    if (colRef) {
      await deleteDoc(colRef);
      setArr((prevArr) => prevArr.filter((item) => item.id !== id))
    }
    if (docRef) {
      await deleteDoc(docRef);
    }
    setArr((prevArr) => {
      return prevArr.map((item) => {
        if (item.id === id) {
          return {
            ...item,
          };
        }
        return item;
      });
    });
  };

  //**************************** Save edited urls
  const handleSaveUrls = async (id: string, newUrl: string) => {
    if (!newUrl || !newUrl.trim()) return;
    const colRef = doc(db, "urls", id);
    const docRef = userId
      ? doc(db, "user-collection", userId, "slug", id)
      : null;
    if (colRef) {
      await updateDoc(colRef, {
        url: newUrl,
      });
    }
    if (docRef) {
      await updateDoc(docRef, {
        url: newUrl,
      });
    }
    setArr((prevArr) => {
      return prevArr.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            url: newUrl,
            editUrls: false,
          };
        }
        return item;
      });
    });
  };

  const handleSave = (id: string) => {
    const newLinkInput = document.getElementById(`new-link-${id}`) as HTMLInputElement;
    if (newLinkInput) {
      handleSaveUrls(id, newLinkInput.value);
    }
  };
  //**************************** End

  useEffect(() => {
    const successMessageShown = sessionStorage.getItem("successMessageShown");
    onAuthStateChanged(auth, (user) => {
      // *********************** Check if device is online
      const handleOnline = () => {
        setIsOnline(true);
      };

      const handleOffline = () => {
        setIsOnline(false);
      };

      if (user && !successMessageShown) {
        // **************** Shows success message
        setSuccessModal(true);
        setModalMessage("Signed In Successfully");

        // Set the flag in session storage to indicate that the message has been shown
        sessionStorage.setItem("successMessageShown", "true");

        // *************** Clears success message after 3 seconds
        const offModal = setTimeout(() => {
          setSuccessModal(false);
          setModalMessage("");
        }, 3000);

        offModal;
      }

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      if (user) {
        // *************** Checks for username
        if (user.displayName) {
          setUserName(user.displayName);
        } else {
          setUserName("");
        }
        const userId = user.uid;
        const userDocRef = userId
          ? collection(db, "user-collection", userId, "slug")
          : "";

        // *************** Gets user shortened links. It fetches the timesClicked property from the urls collection and maps its value to its counterpart in user-collection > userID > slug
        if (userDocRef) {
          getDocs(userDocRef)
            .then((querySnapshot) => {
              if (!querySnapshot.empty) {
                const promises = querySnapshot.docs.map(async (document) => {
                  const colRef = doc(db, "urls", document.id);
                  const colDocSnapshot = await getDoc(colRef);
                  const timesClicked = colDocSnapshot.data()?.timesClicked; // Add null check

                  if (timesClicked !== undefined) {
                    // Add null check
                    await updateDoc(document.ref, { timesClicked }); // Update userDocRef with timesClicked
                  }
                });

                Promise.all(promises).then(() => {
                  if (querySnapshot) {
                    const urls: Array<{
                      id: string;
                      url: string;
                      shortLink: string;
                      qrCodeData: string;
                      editUrls: boolean;
                      timesClicked: number;
                      linkName: string;
                    }> = []; // Define the type of the 'urls' array
                    querySnapshot.docs.forEach((doc) => {
                      const {
                        url,
                        shortLink,
                        qrCodeData,
                        timesClicked,
                        linkName,
                      } = doc.data(); // Destructure the 'url' and 'slug' 'qrCodeData' and other properties from 'doc.data()'
                      urls.push({
                        ...doc.data(),
                        id: doc.id,
                        url,
                        shortLink,
                        qrCodeData,
                        timesClicked,
                        linkName,
                        editUrls: false,
                        deleteConfirm: false,
                      });
                    });
                    setArr(urls);
                  }
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    });
  }, []);

  return isOnline ? (
    <div className="flex flex-col items-center mt-7 relative">
      <div
        className={`absolute transition-all ${
          successModal ? "top-5 md:top-10" : "-top-36"
        }`}
      >
        {successModal ? <SuccessModal success={modalMessage} /> : ""}
      </div>
      <h1 className="self-start md:self-center text-3xl font-display font-bold pl-4 mb-8">
        Welcome <span className="text-gradient">{userName}</span>,
      </h1>
      <InputLongLink text="Shorten a link" />{" "}
      <div className="w-full flex flex-col items-center mt-12 mb-12 px-5">
        <h3 className="self-start font-display font-semibold mb-6 text-2xl pl-4 text-white">My Links</h3>
        <ul className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {arr.length === 0 ? (
            <li key="no-links-yet" className="col-span-full text-center text-text-muted py-12 glass-card rounded-2xl">
              You have no links yet
            </li>
          ) : (
            arr.map((item) => (
              <li
                key={item.id}
                className="flex flex-col glass-card border border-white/5 p-6 rounded-2xl w-full hover:-translate-y-1 transition-transform duration-300"
              >
                <h3 className="font-display font-bold text-xl text-white self-center mb-6 relative after:content-[''] after:absolute after:w-1/2 after:h-[2px] after:bg-gradient-to-r after:from-accent after:to-accent2 after:left-[25%] after:-bottom-2 after:rounded-lg">
                  {item.linkName ? item.linkName : "Untitled Link"}
                </h3>
                
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Destination</span>
                    <a
                      id="long-url"
                      href={item.url}
                      className="text-white hover:text-accent transition-colors truncate"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.url}
                    </a>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Short URL</span>
                    <a
                      href={item.shortLink}
                      className="text-accent hover:text-white transition-colors truncate font-medium"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.shortLink.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </div>
                {item.qrCodeData && (
                  <div className="flex flex-col mt-4 items-center">
                    <span className="text-sm text-text-muted mb-2">QR Code:</span>
                    <div className="p-2 bg-white rounded-xl shadow-lg">
                      <img
                        src={item.qrCodeData}
                        alt={`QR Code for ${item.shortLink}`}
                        className="w-28 h-28"
                      />
                    </div>
                  </div>
                )}
                <div className="w-fit mt-6 self-center bg-surface/50 px-4 py-2 rounded-full border border-white/5">
                  <span className="flex items-center gap-2 font-medium text-text-muted">
                    <Icon.Activity className="text-accent" size={18} />
                    {item.timesClicked} clicks
                  </span>
                </div>
                {!item.editUrls && !item.deleteConfirm && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
                    <button onClick={() => handleEditUrls(item.id)} className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-accent transition-colors">
                      <Icon.Edit3 size={20} />
                    </button>
                    <button onClick={() => handleDeleteConfirm(item.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-500 transition-colors">
                      <Icon.Trash size={20} />
                    </button>
                  </div>
                )}
                
                {item.editUrls && (
                  <div className="w-full flex flex-col mt-6 pt-6 border-t border-white/5 gap-3 animate-in fade-in zoom-in-95">
                    <label className="text-sm font-semibold text-text-muted">Edit Destination URL</label>
                    <input
                      type="url"
                      id={`new-link-${item.id}`}
                      defaultValue={item.url}
                      className="bg-surface/50 border border-white/10 p-3 rounded-xl text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent w-full"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleSave(item.id)}
                        className="flex-1 bg-accent text-white font-semibold py-2 rounded-xl hover:bg-accent2 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleCancelEditUrls(item.id)}
                        className="p-2 bg-surface border border-white/10 text-text-muted rounded-xl hover:text-white transition-colors"
                      >
                        <Icon.X size={20} />
                      </button>
                    </div>
                  </div>
                )}

                {item.deleteConfirm && (
                  <div className="w-full flex flex-col mt-6 pt-6 border-t border-red-500/30 gap-3 animate-in fade-in zoom-in-95">
                    <p className="text-sm font-semibold text-red-400 text-center">Delete this link permanently?</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleDeleteUrls(item.id)}
                        className="flex-1 bg-red-500/20 text-red-500 font-semibold py-2 rounded-xl hover:bg-red-500/40 hover:text-white transition-colors border border-red-500/50"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleCancelDelete(item.id)}
                        className="flex-1 bg-surface border border-white/10 text-text-muted rounded-xl hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  ) : (
    <Offline />
  );
};

export default Dashboard;
