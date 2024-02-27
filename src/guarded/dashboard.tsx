import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import InputLongLink from "../components/shortenInput/input";
const Dashboard: React.FC = () => {
  const auth = getAuth();
  const db = getFirestore();
  const [userName, setUserName] = useState("");
  const url: Array<object> = [];  
  // const [url, setUrl] = useState("")
  // const [slug, setSlug] = useState("")

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.displayName) {
          setUserName(user.displayName);
        }
        const userId = user.uid;
        const userDocRef = userId
          ? collection(db, "user-collection", userId, "slug")
          : "";
        if (userDocRef) {
          getDocs(userDocRef).then((querySnapshot) => {
            if (querySnapshot) {
              querySnapshot.docs.forEach((doc) => {
                url.push({...doc.data(), id: doc.id})
              })
              console.log(url);
              
              
              

              /* setUrl(url)
              setSlug(slug) */
            }
          }).catch((error) => {
            console.log(error);
            
          });
        }
        console.log(userDocRef);
      }
    });
  });

  return (
    <div className="flex flex-col items-center mt-7 ml-4">
      <h1 className="self-start md:self-center text-2xl font-bold pl-4">
        Welcome <span className="text-xl">{userName}</span>,
      </h1>
      <InputLongLink text="Shorten a link" />{" "}
      <div>
        <h3>My Links</h3>
        <div>
           {/* {url.map(link => {
            <li key={link.id}>
              <a href={link.url}>{link.url}</a>
            </li>
           })} */}
          {/* <p>{slug}</p> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
