import { collection, addDoc } from "firebase/firestore";
import db from "../../firebase/firestore";
import auth from "../../firebase/auth";
import { useState } from "react";
import Loader from "../loader/loader";
import { nanoid } from "nanoid";

const InputLongLink = ({ text }: { text: string }) => {
  const [input, setInput] = useState("");
  const [shortLink, setShortLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeData, setQrCodeData] = useState("");

  const user = auth.currentUser;
  const userId = user?.uid;
  const userDocRef = userId
    ? collection(db, "user-collection", userId, "slug")
    : "";

  const colRefs = collection(db, "urls");

  const generateQrCode = async (url: string) => {
    try {
      const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
        url
      )}`;
      const res = await fetch(apiUrl);
      return res.url;
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const slug = nanoid(5); //generates a random 5 character string
    if (!user) {
      setIsLoading(true);
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
    } else if (user && userId) {
      setIsLoading(true);
      try {
        await addDoc(colRefs, {
          url: input,
          slug: slug,
          userId: userId,
        });
      } catch (error) {
        console.log(error);
      }

      const qrCodeDataUrl = await generateQrCode(
        `${window.location.origin}/${slug}`
      );

      if (userDocRef) {
        try {
          await addDoc(userDocRef, {
            slug: slug,
            url: input,
            shortLink: `${window.location.origin}/${slug}`,
            qrCodeData: qrCodeDataUrl,
          });
          setShortLink(`${window.location.origin}/${slug}`);
          if (qrCodeDataUrl) {
            setQrCodeData(qrCodeDataUrl);
          }
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          setIsLoading(false);
        }
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
          className={`relative w-80 h-14 rounded-lg bg-accent font-bold text-background p-3 mt-3 mb-5 border border-accent hover:bg-transparent hover:text-accent transition-all active:translate-y-1 ${
            isLoading ? "cursor-not-allowed bg-transparent" : ""
          }`}
        >
          {isLoading ? <Loader /> : "Shorten"}
        </button>
      </form>
      {/* render the short link if the input is not empty  */}
      {shortLink ? (
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center mt-5">
            <a
              href={shortLink}
              className="p-3 hover:text-accent bg-shadow rounded-lg mr-3 shadow-sm shadow-accent"
            >
              {shortLink ? shortLink : ""}
            </a>
            <button
              onClick={handleCopy}
              className="rounded-lg bg-accent font-bold text-background p-3 border border-accent hover:bg-transparent hover:text-accent transition-all active:translate-y-1"
            >
              Copy
            </button>
          </div>
          {qrCodeData ? (
            <img src={qrCodeData} alt="qr code" className="mt-5 w-44 h-44" />
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default InputLongLink;
