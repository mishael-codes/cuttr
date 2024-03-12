import { useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import db from "../../firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";

const Redirect = () => {
  const { slug } = useParams(); // Extract slug from URL params
  const navigate = useNavigate(); // Get the navigate function from the useNavigate hook
  useEffect(() => {
    const fetchData = async () => {
      const colRef = collection(db, "urls");
      
      try {
        const q = query(colRef, where("slug", "==", slug)); // Create a query for the slug
        const querySnapshot = await getDocs(q); // Execute the query
        const docRef = doc(db, "urls", querySnapshot.docs[0].id);

        if (!querySnapshot.empty) {
          // If documents are found
          const data = querySnapshot.docs[0].data(); // Get the first document's data
          // update the timesClicked field in the document
          await updateDoc(docRef, {
            timesClicked: data.timesClicked + 1,
          });
          location.href = data.url; // Redirect to the URL associated with the slug

        } 
      } catch (error) {
        navigate("notFound");
        console.error("Error fetching document: ", error);
      }
    };

    fetchData(); // Call the fetchData function
  }, [navigate, slug]); // useEffect dependency: slug

  return null; // Return null since this component does not render anything
};

export default Redirect;
