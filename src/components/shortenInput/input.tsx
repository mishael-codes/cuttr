import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import { nanoid } from "nanoid";

const InputLongLink = ({ text }: { text: string }) => {
  const [input, setInput] = useState("");
  const [shortLink, setShortLink] = useState("");

  const db = getFirestore();
  const colRefs = collection(db, "urls");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const slug = nanoid(5); //generates a random 5 character string
    try {
      await addDoc(colRefs, {
        url: input,
        slug: slug,
      });
      setShortLink(`${window.location.origin}/${slug}`)
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
        <button className="w-80 rounded-lg bg-accent font-bold text-background p-3 mt-4 border border-accent hover:bg-transparent hover:text-accent transition-all">
          Shorten
        </button>
      </form>
      {/* render the short link if the input is not empty  */}
      <a href={shortLink}>{shortLink ? shortLink : ""}</a>
    </div>
  );
};

export default InputLongLink;
