// ****************** firebase imports
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import db from "../../firebase/firestore";

// ****************** React Hook
import { useEffect } from "react";

// ****************** React Router
import { useParams, useNavigate } from "react-router-dom";

const Redirect = () => {
  const { slug } = useParams(); // ****************** Extract slug from URL params
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const colRef = collection(db, "urls");
      
      try {
        const q = query(colRef, where("slug", "==", slug)); // Create a query for the slug
        const querySnapshot = await getDocs(q); // Execute the query
        const docRef = doc(db, "urls", querySnapshot.docs[0].id);

        if (!querySnapshot.empty) {
          // ****************** If documents are found get the first document's data
          const data = querySnapshot.docs[0].data(); 
          // ****************** update the timesClicked field in the document
          await updateDoc(docRef, {
            timesClicked: data.timesClicked + 1,
          });
          // ****************** Redirect to the URL associated with the slug
          location.href = data.url; 

        } 
      } catch (error) {
        // ****************** handle errors
        navigate("notFound");
        console.error("Error fetching document: ", error);
      }
    };

    fetchData(); 
  }, [navigate, slug]); 

  return null; // Return null since this component does not render anything
};

export default Redirect;
