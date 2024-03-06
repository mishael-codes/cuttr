import { onAuthStateChanged } from "firebase/auth";
import auth from "../../firebase/auth";
import { useEffect, useState } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import db from "../../firebase/firestore";
import InputLongLink from "../../components/shortenInput/input";
import * as Icon from "react-feather";
import Offline from "../../components/offline";
import { useNavigate } from "react-router-dom";
const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [arr, setArr] = useState<
    Array<{
      id: string;
      url: string;
      shortLink: string;
      qrCodeData: string;
      timesClicked: number;
      editUrls: boolean;
    }>
  >([]);
  const navigate = useNavigate();

  // shorten link length in their respective containers
  const truncate = (str: string, n: number) => {
    const truncatedString: string =
      str.length > n ? str.substring(0, n - 1) + "..." : str;
    return truncatedString;
  };

  // trigger edit mode for urls
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

  // cancel edit mode for urls
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
  }

  // save edited urls
  const handleSaveUrls = async (id: string) => {
    const user = auth.currentUser;
    const userId = user?.uid;
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
    navigate("/dashboard");
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (centerY - y) / 10;
    const rotateY = (centerX - x) / 10;

    e.currentTarget.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = "rotateX(0deg) rotateY(0deg)";
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.displayName) {
          setUserName(user.displayName);
        } else {
          setUserName("");
        }

        const colRef = collection(db, "urls");
        const userId = user.uid;
        const userDocRef = userId
          ? collection(db, "user-collection", userId, "slug")
          : "";
        if (userDocRef) {
          getDocs(colRef)
            .then((querySnapshot) => {
              if (querySnapshot) {
                const urls: Array<{
                  id: string;
                  url: string;
                  shortLink: string;
                  qrCodeData: string;
                  editUrls: boolean;
                  timesClicked: number;
                }> = []; // Define the type of the 'urls' array
                querySnapshot.docs.forEach((doc) => {
                  const { url, shortLink, qrCodeData, timesClicked } = doc.data(); // Destructure the 'url' and 'slug' 'qrCodeData' properties from 'doc.data()'
                  urls.push({
                    ...doc.data(),
                    id: doc.id,
                    url,
                    shortLink,
                    qrCodeData,
                    timesClicked,
                    editUrls: false, // Initialize edit mode as false for each card
                  }); // Include the 'url' and 'slug' and 'qrCodeData' properties in the object being pushed to 'urls' array
                });
                setArr(urls);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    });
  }, []);

  return navigator.onLine ? (
    <div className="flex flex-col items-center mt-7">
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
                className="flex flex-col shadow shadow-accent p-5 rounded-lg w-80 overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
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
                      {!item.editUrls ? truncate(item.url, 20) : item.url}
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
                      {truncate(item.shortLink, 20)}
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
                <span>{item.timesClicked}</span>
                {!item.editUrls ? (
                  <div className="mt-6">
                    <Icon.Edit3
                    className="cursor-pointer text-accent border w-10 h-10 rounded-lg p-1 shadow-sm shadow-accent"
                    onClick={() => handleEditUrls(item.id)}
                  />
                  </div>
                ) : (
                  <div className="w-full flex justify-between mt-6">
                    <Icon.Save
                    className="cursor-pointer text-accent border w-10 h-10 rounded-lg p-1"
                    onClick={() => handleSaveUrls(item.id)}
                  />
                  <Icon.X className="cursor-pointer text-red-600 border border-red-600 w-10 h-10 rounded-lg p-1" onClick={() => handleCancelEditUrls(item.id)}/>
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