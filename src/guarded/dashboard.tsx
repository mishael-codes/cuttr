import { onAuthStateChanged } from "firebase/auth";
import auth from "../firebase/auth";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "../firebase/firestore";
import InputLongLink from "../components/shortenInput/input";
const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState("");
  // const [url, setUrl] = useState("")
  // const [slug, setSlug] = useState("")
  const [arr, setArr] = useState<
    Array<{ id: string; url: string; shortLink: string }>
  >([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.displayName) {
          setUserName(user.displayName);
        } else {
          setUserName("");
        }
        const userId = user.uid;
        const userDocRef = userId
          ? collection(db, "user-collection", userId, "slug")
          : "";
        if (userDocRef) {
          getDocs(userDocRef)
            .then((querySnapshot) => {
              if (querySnapshot) {
                const urls: Array<{
                  id: string;
                  url: string;
                  shortLink: string;
                }> = []; // Define the type of the 'urls' array
                querySnapshot.docs.forEach((doc) => {
                  const { url, shortLink } = doc.data(); // Destructure the 'url' and 'slug' properties from 'doc.data()'
                  urls.push({ ...doc.data(), id: doc.id, url, shortLink }); // Include the 'url' and 'slug' properties in the object being pushed to 'urls' array
                });
                console.log(urls);
                setArr(urls);
                /* setUrl(url)
              setSlug(slug) */
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    });
  }, []);

  return (
    <div className="flex flex-col items-center mt-7 ml-4">
      <h1 className="self-start md:self-center text-2xl font-bold pl-4">
        Welcome <span className="text-xl">{userName}</span>,
      </h1>
      <InputLongLink text="Shorten a link" />{" "}
      <div className="w-screen flex flex-col items-center mt-7 ml-4">
        <h3 className="self-start font-semibold mb-5 pl-4">My Links</h3>
        <ul className="grid md:grid-cols-2 gap-5">
          {arr.length === 0 ? (
            <li key="no-links-yet">You have no links yet</li>
          ) : (
            arr.map((item) => (
              <li
                key={item.id}
                className="flex flex-col shadow shadow-accent p-5 rounded-lg"
              >
                <a href={item.url}>{item.url}</a>
                <a href={item.shortLink}>{item.shortLink}</a>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
