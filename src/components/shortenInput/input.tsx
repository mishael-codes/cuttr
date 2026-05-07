// ****************** firebase imports
import auth from "../../firebase/auth";
import db from "../../firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  setDoc,
  doc,
  getDocs
} from "firebase/firestore";

// ****************** React Hooks
import { useState, useEffect } from "react";

// ****************** Component Input
import Loader from "../loader/loader";

// ****************** NPM Imports
import { nanoid } from "nanoid";
import * as Icon from "react-feather";

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
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      user ? setIsUser(true) : setIsUser(false);
    });
  });

  const user = auth.currentUser;
  const userId = user?.uid;
  const userDocRef = userId
    ? collection(db, "user-collection", userId, "slug")
    : "";

  const colRefs = collection(db, "urls");

  // ****************** Checks for link name
  const handleLinkName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nameOfLink = e.target.value;
    if (!nameOfLink) {
      setNameError("Name is required");
    } else {
      setLinkName(nameOfLink.trim());
    }
  };

  // ****************** Alias check
  const handleAlias = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const linkAlias = e.target.value;
    if (colRefs && linkAlias) {
      try {
        let aliasAvailable = true;

        getDocs(colRefs).then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const { slug } = doc.data();
            if (slug === linkAlias) {
              aliasAvailable = false;
            }
          });

          if (aliasAvailable) {
            setAliasError("Alias is available");
          } else {
            setAliasError("Alias already exists");
          }
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
      )}&color=000000&bgcolor=ffffff&margin=10`;
      const res = await fetch(apiUrl);
      return res.url;
    } catch (error) {
      console.log(error);
    }
  };

  // ****************** Watches the link input field for changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setInput(url.trim());
    setInputError("");
  };

  // ****************** Handles submission logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const slug = nanoid(5); // generates a random 5 character string
    if (!user) {
      if (input.startsWith("https://") || input.startsWith("http://")) {
        setIsLoading(true);
        try {
          const docRef = doc(colRefs, slug); // Create a DocumentReference using the slug as the document ID
          await setDoc(docRef, {
            url: input,
            slug: slug,
          });
          setShortLink(`${window.location.origin}/${slug}`);
          setIsLoading(false);
          setInput("");
          console.log(input);
        } catch (error) {
          console.log(error);
          setIsLoading(false);
        }
      } else if (!input) {
        setInputError("Link is required");
      } else setInputError("Please enter a valid link");
    } else if (user && userId) {
      if (input && linkName) {
        setIsLoading(true);
        const docId = nanoid(15);
        const docRef = doc(colRefs, docId); // Create a DocumentReference using the docId as the document ID
        if (!alias || alias.trim() === "") {
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
              setInput("");
              setAlias("");
              setLinkName("");
            } catch (error) {
              console.log(error);
              setIsLoading(false);
            }
          }
        } else if (alias) {
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
              setInput("");
              setAlias("");
              setLinkName("");
            } catch (error) {
              console.log(error);
              setIsLoading(false);
            }
          }
        }
      } else {
        setInputError("Link is required");
        setNameError("Name is required");
      }
    }
  };

  // ****************** Copies the shortened link
  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(shortLink);
      alert("Link copied to clipboard");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full flex flex-col items-center">
      {text && <p className="font-display font-semibold text-xl mb-6 text-white">{text}</p>}
      
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="url" className="text-sm font-semibold text-text-muted ml-1">
            Destination URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icon.Link className="h-5 w-5 text-text-muted" />
            </div>
            <input
              type="url"
              name="url"
              id="url"
              value={input}
              onChange={handleInputChange}
              className="w-full bg-surface/50 border border-white/10 p-4 pl-12 rounded-xl text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-text-muted/50"
              placeholder="https://example.com/very/long/url"
            />
          </div>
          {inputError && <p className="text-red-400 text-xs mt-1 ml-1">{inputError}</p>}
        </div>

        {isUser && (
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="name" className="text-sm font-semibold text-text-muted ml-1">
                Link Title
              </label>
              <input
                type="text"
                id="name"
                onChange={handleLinkName}
                value={linkName}
                className="w-full bg-surface/50 border border-white/10 p-4 rounded-xl text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-text-muted/50"
                placeholder="My Awesome Link"
              />
              {nameError && <p className="text-red-400 text-xs mt-1 ml-1">{nameError}</p>}
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="alias" className="text-sm font-semibold text-text-muted ml-1">
                Custom Alias (Optional)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-text-muted">cuttr.app/</span>
                <input
                  type="text"
                  id="alias"
                  onChange={handleAlias}
                  value={alias}
                  className="w-full bg-surface/50 border border-white/10 p-4 pl-24 rounded-xl text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-text-muted/50"
                  placeholder="custom-name"
                />
              </div>
              {aliasError && (
                <p className={`text-xs mt-1 ml-1 ${aliasError === "Alias already exists" ? "text-red-400" : "text-emerald-400"}`}>
                  {aliasError}
                </p>
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="relative w-full h-14 mt-4 rounded-xl bg-gradient-to-r from-accent to-accent2 font-bold text-white shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center group"
        >
          {isLoading ? (
            <Loader />
          ) : (
            <span className="flex items-center gap-2">
              Shorten Link <Icon.ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </button>
      </form>

      {/* Result Section */}
      {shortLink && (
        <div className="mt-8 w-full glass-card rounded-2xl p-6 border border-accent/30 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4">
          <h4 className="text-sm font-medium text-text-muted mb-4 uppercase tracking-wider">Your short link is ready!</h4>
          
          <div className="flex flex-col md:flex-row items-center gap-4 w-full">
            <a
              href={shortLink}
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-surface/80 px-6 py-4 rounded-xl text-accent font-medium text-lg border border-white/5 hover:border-accent/30 transition-colors truncate text-center md:text-left w-full"
            >
              {shortLink}
            </a>
            <button
              onClick={handleCopy}
              className="w-full md:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors flex items-center justify-center gap-2 border border-white/10"
            >
              <Icon.Copy size={18} />
              Copy
            </button>
          </div>

          {qrCodeData && (
            <div className="mt-8 flex flex-col items-center gap-3">
              <span className="text-sm text-text-muted">Scan QR Code</span>
              <div className="p-3 bg-white rounded-xl shadow-lg">
                <img src={qrCodeData} alt="QR Code" className="w-32 h-32" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InputLongLink;
