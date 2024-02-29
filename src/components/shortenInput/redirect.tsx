import { useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import db from "../../firebase/firestore";
// import auth from "../../firebase/auth";
import { useParams } from "react-router-dom";

const Redirect = () => {
  const { slug } = useParams(); // Extract slug from URL params

  useEffect(() => {
    const fetchData = async () => {
      const colRef = collection(db, "urls");

      try {
        const q = query(colRef, where("slug", "==", slug)); // Create a query for the slug
        const querySnapshot = await getDocs(q); // Execute the query

        if (!querySnapshot.empty) {
          // If documents are found
          const data = querySnapshot.docs[0].data(); // Get the first document's data
          window.location.href = data.url; // Redirect to the URL associated with the slug
        } else {
          console.log("No document found!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    fetchData(); // Call the fetchData function
  }, [slug]); // useEffect dependency: slug

  return null; // Return null since this component does not render anything
};

export default Redirect;
