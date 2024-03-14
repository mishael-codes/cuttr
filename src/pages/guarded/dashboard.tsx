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
            editUrls: !item.editUrls, // Toggle edit mode for the specific card
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
            editUrls: !item.editUrls,
          };
        }
        return item;
      });
    });
  };

  const handleDeleteUrls = async (id: string) => {
    const colRef = doc(db, "urls", id);
    const docRef = userId
      ? doc(db, "user-collection", userId, "slug", id)
      : null;
    if (colRef) {
      await deleteDoc(colRef);
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
        console.log(item.id);
        return item;
      });
    });
    location.reload();
  };

  //**************************** Save edited urls
  const handleSaveUrls = async (id: string) => {
    const colRef = doc(db, "urls", id);
    const docRef = userId
      ? doc(db, "user-collection", userId, "slug", id)
      : null;
    const newUrl = document.getElementById("long-url") as HTMLAnchorElement;
    if (colRef) {
      await updateDoc(colRef, {
        url: newUrl.textContent,
      });
    }
    if (docRef) {
      await updateDoc(docRef, {
        url: newUrl.textContent,
      });
    }
    setArr((prevArr) => {
      return prevArr.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            editUrls: !item.editUrls,
          };
        }
        console.log(item.id);
        return item;
      });
    });
    location.reload();
  };
  //**************************** End
  //**************************** Card hover animation

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const userScreen = screen.width;
    
    if (userScreen >= 1024) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (centerY - y) / 10;
      const rotateY = (centerX - x) / 10;

      e.currentTarget.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = "rotateX(0deg) rotateY(0deg)";
  };
  //**************************** End card hover animation

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
        setTimeout(() => {
          setSuccessModal(false);
          setModalMessage("");
        }, 3000);
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
                        editUrls: false, // Initialize edit mode as false for each card
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
      <h1 className="self-start md:self-center text-2xl font-bold pl-4">
        Welcome <span className="text-xl">{userName}</span>,
      </h1>
      <InputLongLink text="Shorten a link" />{" "}
      <div className="w-full flex flex-col items-center mt-7 mb-12">
        <h3 className="self-start font-semibold mb-5 text-xl pl-4">My Links</h3>
        <ul className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {arr.length === 0 ? (
            <li key="no-links-yet">You have no links yet</li>
          ) : (
            arr.map((item) => (
              <li
                key={item.id}
                className="flex flex-col shadow shadow-accent p-5 rounded-lg w-80 overflow-hidden bg-background"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <h3 className="font-bold self-center mb-4 relative z-30 after:content-[''] after:absolute after:w-1/4 after:h-[3px] after:bg-accent after:-z-10 after:left-[50%] after:translate-x-[-50%] after:top-5 after:rounded-lg">
                  {item.linkName ? item.linkName : ""}
                </h3>
                <span className="font-semibold text-md flex items-center justify-between">
                  <div>
                    Long Url:{" "}
                    <a
                      id="long-url"
                      href={item.url}
                      className="font-medium"
                      target="_blank"
                      rel="noreferrer"
                      contentEditable={item.editUrls ? true : false}
                      autoFocus={item.editUrls ? true : false}
                    >
                      {!item.editUrls ? Truncate(item.url, 20) : item.url}
                    </a>
                  </div>
                </span>
                <span className="font-semibold text-md flex items-center justify-between">
                  <div>
                    Short Url:{" "}
                    <a
                      href={item.shortLink}
                      className="font-medium"
                      target="_blank"
                      rel="noreferrer"
                      contentEditable={item.editUrls ? true : false}
                    >
                      {Truncate(item.shortLink, 20)}
                    </a>
                  </div>
                </span>
                {item.qrCodeData && (
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg">QR Code:</span>
                    <img
                      src={item.qrCodeData}
                      alt={`QR Code for ${item.shortLink}`}
                      className="mt-2 w-32 h-32 self-center shadow-[3px_3px_5px_#ddb640] rounded-lg p-1"
                    />
                  </div>
                )}
                <div className="w-fit h-[20%]  mt-5 self-center">
                  <span className="flex">
                    <Icon.Activity className="text-accent" />:{" "}
                    {item.timesClicked}
                  </span>
                </div>
                {!item.editUrls ? (
                  <div className="flex items-center justify-between">
                    <div className="mt-6">
                      <Icon.Edit3
                        className="cursor-pointer text-accent border w-10 h-10 rounded-lg p-1 shadow-sm shadow-accent"
                        onClick={() => handleEditUrls(item.id)}
                      />
                    </div>
                    <div className="mt-6">
                      <Icon.Trash
                        className="cursor-pointer text-red-600 border w-10 h-10 rounded-lg p-1 shadow-sm shadow-accent"
                        onClick={() => handleDeleteUrls(item.id)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full flex justify-between mt-6">
                    <Icon.Save
                      className="cursor-pointer text-accent border w-10 h-10 rounded-lg p-1"
                      onClick={() => handleSaveUrls(item.id)}
                    />
                    <Icon.X
                      className="cursor-pointer text-red-600 border border-red-600 w-10 h-10 rounded-lg p-1"
                      onClick={() => handleCancelEditUrls(item.id)}
                    />
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
