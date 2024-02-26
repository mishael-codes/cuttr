import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import Loader from "../loader/loader";
import { nanoid } from "nanoid";

const InputLongLink = ({ text }: { text: string }) => {
  const [input, setInput] = useState("");
  const [shortLink, setShortLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  const db = getFirestore();
  const colRefs = collection(db, "urls");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setIsLoading(true);
      const slug = nanoid(5); //generates a random 5 character string
      try {
        await addDoc(colRefs, {
          url: input,
          slug: slug,
        });
        setShortLink(`${window.location.origin}/${slug}`);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
  };

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(shortLink);
      alert("Link copied to clipboard");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="mt-10 flex items-center justify-center flex-col">
      <p>{text}</p>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="url"
          name="url"
          id="url"
          value={input}
          onChange={handleChange}
          className="w-80 h-4 p-6 rounded-lg bg-transparent border border-accent focus:outline-none focus:border-2 mt-2"
          placeholder="https://www.example.com"
        />
        <button
          className={`relative w-80 h-14 rounded-lg bg-accent font-bold text-background p-3 mt-3 mb-5 border border-accent hover:bg-transparent hover:text-accent transition-all ${
            isLoading ? "cursor-not-allowed bg-transparent" : ""
          }`}
        >
          {isLoading ? <Loader /> : "Shorten"}
        </button>
      </form>
      {/* render the short link if the input is not empty  */}
      {shortLink ? (
        <div className="flex items-center justify-center mt-5">
          <a href={shortLink} className="p-3 hover:text-accent">
            {shortLink ? shortLink : ""}
          </a>
          <button
            onClick={handleCopy}
            className="rounded-lg bg-accent font-bold text-background p-3 border border-accent hover:bg-transparent hover:text-accent transition-all"
          >
            Copy
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default InputLongLink;
