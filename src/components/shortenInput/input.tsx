import { collection, setDoc, doc, getDocs } from "firebase/firestore";
import db from "../../firebase/firestore";
import auth from "../../firebase/auth";
import { useState } from "react";
import Loader from "../loader/loader";
import { nanoid } from "nanoid";

const InputLongLink = ({ text }: { text: string }) => {
  const [input, setInput] = useState("");
  const [linkName, setLinkName] = useState("");
  const [alias, setAlias] = useState("");
  const [shortLink, setShortLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeData, setQrCodeData] = useState("");
  const [inputError, setInputError] = useState("");
  const [nameError, setNameError] = useState("");
  const [aliasError, setAliasError] = useState("");

  const user = auth.currentUser;
  const userId = user?.uid;
  const userDocRef = userId
    ? collection(db, "user-collection", userId, "slug")
    : "";

  const colRefs = collection(db, "urls");

  const handleLinkName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nameOfLink = e.target.value;
    if (!nameOfLink) {
      setNameError("Name is required");
    } else {
      setLinkName(nameOfLink.trim());
    }
  };

  const handleAlias = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const linkAlias = e.target.value;
    if (userDocRef && linkAlias) {
      try {
        getDocs(userDocRef).then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const { slug } = doc.data();
            if (slug === linkAlias.trim()) {
              setAliasError("Alias already exists");
            } else {
              setAliasError("Alias is available");
            }
          });
        });
      } catch (error) {
        console.log(error);
      }
    } else if (!linkAlias) {
      setAliasError("");
    }
    setAlias(linkAlias.trim());
  };

  const generateQrCode = async (url: string) => {
    try {
      const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
        url
      )}&color=ddb640&bgcolor=37323e&margin=10`;
      const res = await fetch(apiUrl);
      return res.url;
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;  
    setInput(url.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (input && linkName) {
      const slug = nanoid(5); //generates a random 5 character string
      if (!user) {
        setIsLoading(true);
        try {
          const docRef = doc(colRefs, slug); // Create a DocumentReference using the slug as the document ID
          await setDoc(docRef, {
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
        const docId = nanoid(15);
        const docRef = doc(colRefs, docId); // Create a DocumentReference using the docId as the document ID
        if (alias) {
          const qrCodeDataUrl = await generateQrCode(
            `${window.location.origin}/${alias}`
          );
          try {
            await setDoc(docRef, {
              linkName: linkName,
              qrCodeData: qrCodeDataUrl,
              shortLink: `${window.location.origin}/${alias}`,
              slug: alias,
              timesClicked: 0,
              url: input,
            });
          } catch (error) {
            console.log(error);
          }

          if (userDocRef) {
            const DocRef = doc(userDocRef, docId);
            try {
              await setDoc(DocRef, {
                linkName: linkName,
                qrCodeData: qrCodeDataUrl,
                shortLink: `${window.location.origin}/${alias}`,
                slug: alias,
                timesClicked: 0,
                url: input,
              });
              setShortLink(`${window.location.origin}/${alias}`);
              if (qrCodeDataUrl) {
                setQrCodeData(qrCodeDataUrl);
              }
              setIsLoading(false);
            } catch (error) {
              console.log(error);
              setIsLoading(false);
            }
          } else {
            const qrCodeDataUrl = await generateQrCode(
              `${window.location.origin}/${slug}`
            );
            try {
              await setDoc(docRef, {
                linkName: linkName,
                qrCodeData: qrCodeDataUrl,
                shortLink: `${window.location.origin}/${slug}`,
                slug: slug,
                timesClicked: 0,
                url: input,
              });
            } catch (error) {
              console.log(error);
            }

            if (userDocRef) {
              const DocRef = doc(userDocRef, docId);
              try {
                await setDoc(DocRef, {
                  linkName: linkName,
                  qrCodeData: qrCodeDataUrl,
                  shortLink: `${window.location.origin}/${slug}`,
                  slug: slug,
                  timesClicked: 0,
                  url: input,
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
        }
      }
    } else {
      setIsLoading(false);
      if (!input) {
        setInputError("Please enter a valid URL");
      }
      if (!linkName) {
        setNameError("Name is required");
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
    <div className="mt-10 flex items-center justify-center flex-col bg-background p-14 rounded-lg">
      <p className="font-semibold mb-10">{text}</p>
      <form onSubmit={handleSubmit} className="flex flex-col w-fit">
        <label htmlFor="url" className="flex flex-col items-start">
          Enter a link
          <input
            type="url"
            name="url"
            id="url"
            value={input}
            onChange={handleInputChange}
            className="w-80 h-4 p-6 rounded-lg bg-transparent border border-accent focus:outline-none focus:border-2 mt-2"
            placeholder="https://www.example.com"
          />
          {inputError && (
            <p className="text-red-600 font-light text-xs">{inputError}</p>
          )}
        </label>
        <div className="w-full flex items-center justify-between mt-3">
          <label htmlFor="name" className="flex flex-col items-start">
            Name{" "}
            <input
              type="text"
              id="name"
              onChange={handleLinkName}
              className="w-[150px] h-6 p-6 rounded-lg bg-transparent border border-accent focus:outline-none focus:border-2"
            />
            {nameError && (
              <p className="text-red-600 font-light text-xs">{nameError}</p>
            )}
          </label>
          <label htmlFor="alias" className="flex flex-col items-start">
            Alias
            <input
              type="text"
              id="alias"
              onChange={handleAlias}
              className=" w-[150px] h-6 p-6 rounded-lg bg-transparent border border-accent focus:outline-none focus:border-2"
            />
            {aliasError && (
              <p
                className={`${
                  aliasError === "Alias already exists"
                    ? "text-red-600 font-light text-xs"
                    : "text-green-600 font-thin text-xs"
                }`}
              >
                {aliasError}
              </p>
            )}
          </label>
        </div>
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
              target="_blank"
              rel="noreferrer"
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
