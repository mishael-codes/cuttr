// ********************** firebase imports
import auth from "../../firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import db from "../../firebase/firestore";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// ******************** React Hooks
import { useEffect, useState, useMemo } from "react";

// ******************** React Feather
import * as Icon from "react-feather";

// ******************** Components imports
import Offline from "../../components/offline";
import InputLongLink from "../../components/shortenInput/input";
import SuccessModal from "../../components/modals/successModal";

interface ShortenedLink {
  id: string;
  url: string;
  shortLink: string;
  qrCodeData: string;
  timesClicked: number;
  editUrls: boolean;
  deleteConfirm: boolean;
  linkName: string;
  createdAt?: number;
}

const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [successModal, setSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"clicks" | "recent" | "name">("clicks");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedDestId, setCopiedDestId] = useState<string | null>(null);
  const [expandedQrId, setExpandedQrId] = useState<string | null>(null);
  const [editingUrlValue, setEditingUrlValue] = useState<Record<string, string>>({});
  const [showCreateCard, setShowCreateCard] = useState(true);

  const [arr, setArr] = useState<Array<ShortenedLink>>([]);

  const user = auth.currentUser;
  const userId = user?.uid;

  // Trigger edit mode for urls
  const handleEditUrls = (id: string, currentUrl: string) => {
    setEditingUrlValue((prev) => ({ ...prev, [id]: currentUrl }));
    setArr((prevArr) =>
      prevArr.map((item) =>
        item.id === id ? { ...item, editUrls: true, deleteConfirm: false } : item
      )
    );
  };

  // Cancel edit mode for urls
  const handleCancelEditUrls = (id: string) => {
    setArr((prevArr) =>
      prevArr.map((item) => (item.id === id ? { ...item, editUrls: false } : item))
    );
  };

  const handleDeleteConfirm = (id: string) => {
    setArr((prevArr) =>
      prevArr.map((item) =>
        item.id === id ? { ...item, deleteConfirm: true, editUrls: false } : item
      )
    );
  };

  const handleCancelDelete = (id: string) => {
    setArr((prevArr) =>
      prevArr.map((item) => (item.id === id ? { ...item, deleteConfirm: false } : item))
    );
  };

  // Delete created urls
  const handleDeleteUrls = async (id: string) => {
    try {
      const colRef = doc(db, "urls", id);
      const docRef = userId ? doc(db, "user-collection", userId, "slug", id) : null;
      if (colRef) {
        await deleteDoc(colRef);
      }
      if (docRef) {
        await deleteDoc(docRef);
      }
      setArr((prevArr) => prevArr.filter((item) => item.id !== id));
      setModalMessage("Link deleted successfully");
      setSuccessModal(true);
      setTimeout(() => setSuccessModal(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  // Save edited urls
  const handleSaveUrls = async (id: string, newUrl: string) => {
    if (!newUrl || !newUrl.trim()) return;
    try {
      const colRef = doc(db, "urls", id);
      const docRef = userId ? doc(db, "user-collection", userId, "slug", id) : null;
      if (colRef) {
        await updateDoc(colRef, { url: newUrl.trim() });
      }
      if (docRef) {
        await updateDoc(docRef, { url: newUrl.trim() });
      }
      setArr((prevArr) =>
        prevArr.map((item) =>
          item.id === id ? { ...item, url: newUrl.trim(), editUrls: false } : item
        )
      );
      setModalMessage("Destination URL updated");
      setSuccessModal(true);
      setTimeout(() => setSuccessModal(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = (id: string) => {
    const val = editingUrlValue[id];
    if (val) {
      handleSaveUrls(id, val);
    }
  };

  const handleCopyShortLink = (id: string, link: string) => {
    try {
      navigator.clipboard.writeText(link);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyDestLink = (id: string, dest: string) => {
    try {
      navigator.clipboard.writeText(dest);
      setCopiedDestId(id);
      setTimeout(() => setCopiedDestId(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadQrCode = (linkName: string, qrData: string) => {
    try {
      const a = document.createElement("a");
      a.href = qrData;
      a.download = `cuttr-qr-${(linkName || "link").replace(/\s+/g, "-").toLowerCase()}.png`;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const successMessageShown = sessionStorage.getItem("successMessageShown");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      if (user && !successMessageShown) {
        setSuccessModal(true);
        setModalMessage("Signed In Successfully");
        sessionStorage.setItem("successMessageShown", "true");
        setTimeout(() => {
          setSuccessModal(false);
          setModalMessage("");
        }, 3000);
      }

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      if (user) {
        setUserName(user.displayName || user.email?.split("@")[0] || "");
        const currentUid = user.uid;
        const userDocRef = currentUid
          ? collection(db, "user-collection", currentUid, "slug")
          : null;

        if (userDocRef) {
          getDocs(userDocRef)
            .then((querySnapshot) => {
              if (!querySnapshot.empty) {
                const promises = querySnapshot.docs.map(async (document) => {
                  const colRef = doc(db, "urls", document.id);
                  const colDocSnapshot = await getDoc(colRef);
                  const timesClicked = colDocSnapshot.data()?.timesClicked;

                  if (timesClicked !== undefined) {
                    await updateDoc(document.ref, { timesClicked });
                  }
                });

                Promise.all(promises).then(() => {
                  const urls: Array<ShortenedLink> = [];
                  querySnapshot.docs.forEach((d) => {
                    const data = d.data();
                    urls.push({
                      id: d.id,
                      url: data.url,
                      shortLink: data.shortLink,
                      qrCodeData: data.qrCodeData,
                      timesClicked: data.timesClicked || 0,
                      linkName: data.linkName || "",
                      editUrls: false,
                      deleteConfirm: false,
                    });
                  });
                  setArr(urls);
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    });

    return () => unsubscribe();
  }, []);

  // Compute KPI metrics
  const totalClicks = useMemo(() => {
    return arr.reduce((acc, curr) => acc + (curr.timesClicked || 0), 0);
  }, [arr]);

  const topPerformer = useMemo(() => {
    if (arr.length === 0) return null;
    return [...arr].sort((a, b) => (b.timesClicked || 0) - (a.timesClicked || 0))[0];
  }, [arr]);

  const avgClicks = useMemo(() => {
    if (arr.length === 0) return 0;
    return (totalClicks / arr.length).toFixed(1);
  }, [arr.length, totalClicks]);

  // Filter and sort links
  const filteredLinks = useMemo(() => {
    let result = [...arr];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.linkName?.toLowerCase().includes(q) ||
          item.url?.toLowerCase().includes(q) ||
          item.shortLink?.toLowerCase().includes(q)
      );
    }

    if (sortBy === "clicks") {
      result.sort((a, b) => (b.timesClicked || 0) - (a.timesClicked || 0));
    } else if (sortBy === "name") {
      result.sort((a, b) => (a.linkName || "Untitled").localeCompare(b.linkName || "Untitled"));
    }
    return result;
  }, [arr, searchQuery, sortBy]);

  return isOnline ? (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      {/* Toast Alert */}
      <div
        className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          successModal ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8 pointer-events-none"
        }`}
      >
        {successModal && <SuccessModal success={modalMessage} />}
      </div>

      {/* Header & Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white tracking-tight">
            Welcome <span className="text-gradient">{userName ? userName : "Back"}</span>,
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Track real-time click analytics, manage custom aliases, and create QR codes.
          </p>
        </div>

        <button
          onClick={() => setShowCreateCard(!showCreateCard)}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-black font-semibold text-sm hover:bg-accent2 shadow-md shadow-accent/20 active:scale-95 transition-all"
        >
          <Icon.Plus size={16} />
          <span>{showCreateCard ? "Hide Shortener" : "Create New Link"}</span>
        </button>
      </div>

      {/* Analytics KPI Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Links */}
        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-muted mb-3">
            <span className="text-xs sm:text-sm font-medium">Total Links</span>
            <div className="p-2 rounded-xl bg-white/5 text-accent">
              <Icon.Link2 size={18} />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-display font-bold text-white font-mono tabular-nums">
              {arr.length}
            </span>
            <p className="text-[11px] text-text-muted mt-0.5">Shortened destinations</p>
          </div>
        </div>

        {/* Total Clicks */}
        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-muted mb-3">
            <span className="text-xs sm:text-sm font-medium">Total Clicks</span>
            <div className="p-2 rounded-xl bg-accent/15 text-accent">
              <Icon.BarChart2 size={18} />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-display font-bold text-white font-mono tabular-nums">
              {totalClicks.toLocaleString()}
            </span>
            <p className="text-[11px] text-text-muted mt-0.5">Aggregated engagement</p>
          </div>
        </div>

        {/* Avg Clicks */}
        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-muted mb-3">
            <span className="text-xs sm:text-sm font-medium">Avg Clicks / Link</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Icon.TrendingUp size={18} />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-display font-bold text-white font-mono tabular-nums">
              {avgClicks}
            </span>
            <p className="text-[11px] text-text-muted mt-0.5">Performance metric</p>
          </div>
        </div>

        {/* Top Performer */}
        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-muted mb-3">
            <span className="text-xs sm:text-sm font-medium">Top Link</span>
            <div className="p-2 rounded-xl bg-accent2/15 text-accent2">
              <Icon.Award size={18} />
            </div>
          </div>
          <div className="min-w-0">
            <span className="text-2xl sm:text-3xl font-display font-bold text-accent font-mono tabular-nums">
              {topPerformer ? `${topPerformer.timesClicked || 0}` : "0"}
            </span>
            <p className="text-[11px] text-text-muted truncate mt-0.5" title={topPerformer?.linkName || "None yet"}>
              {topPerformer?.linkName ? topPerformer.linkName : "No traffic yet"}
            </p>
          </div>
        </div>
      </div>

      {/* Shorten Link Box (Collapsible / Prominent) */}
      {showCreateCard && (
        <section className="glass-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-accent/20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="mb-4">
            <h2 className="text-lg sm:text-xl font-display font-bold text-white">Create a Short Link</h2>
            <p className="text-xs sm:text-sm text-text-muted">
              Enter your long URL below, optionally set a custom alias or descriptive title.
            </p>
          </div>
          <InputLongLink text="" />
        </section>
      )}

      {/* Link Management Section */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="font-display font-bold text-xl sm:text-2xl text-white">My Links</h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-accent font-mono">
              {filteredLinks.length} {filteredLinks.length === 1 ? "link" : "links"}
            </span>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Icon.Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search links..."
                className="w-full bg-surface/70 border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-sm text-white placeholder:text-text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
                >
                  <Icon.X size={14} />
                </button>
              )}
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-1.5 p-1 bg-surface/70 border border-white/10 rounded-xl shrink-0 self-end sm:self-auto">
              <button
                onClick={() => setSortBy("clicks")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  sortBy === "clicks"
                    ? "bg-accent text-black font-semibold shadow-sm"
                    : "text-text-muted hover:text-white"
                }`}
              >
                Top Clicks
              </button>
              <button
                onClick={() => setSortBy("name")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  sortBy === "name"
                    ? "bg-accent text-black font-semibold shadow-sm"
                    : "text-text-muted hover:text-white"
                }`}
              >
                Name
              </button>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredLinks.length === 0 ? (
            <div className="col-span-full py-16 px-6 glass-card rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent mb-4">
                <Icon.Link2 size={28} />
              </div>
              <h4 className="text-lg font-display font-bold text-white mb-1">
                {searchQuery ? "No matching links found" : "You have no links yet"}
              </h4>
              <p className="text-sm text-text-muted max-w-sm mb-6">
                {searchQuery
                  ? `No links matched "${searchQuery}". Try clearing your search query.`
                  : "Shorten your first destination URL using the generator above to start collecting click analytics."}
              </p>
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors"
                >
                  Clear search
                </button>
              ) : (
                <button
                  onClick={() => setShowCreateCard(true)}
                  className="px-5 py-2.5 rounded-xl bg-accent text-black text-sm font-bold shadow-md shadow-accent/20 hover:bg-accent2 transition-all"
                >
                  Create First Link
                </button>
              )}
            </div>
          ) : (
            filteredLinks.map((item) => {
              const isCopied = copiedId === item.id;
              const isDestCopied = copiedDestId === item.id;
              const isQrExpanded = expandedQrId === item.id;

              return (
                <article
                  key={item.id}
                  className="glass-card border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-white/20 transition-all duration-200 relative group"
                >
                  <div>
                    {/* Card Top: Title & Click counter */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="min-w-0 flex-1">
                        <h4
                          className="font-display font-bold text-lg text-white truncate"
                          title={item.linkName || "Untitled Link"}
                        >
                          {item.linkName ? item.linkName : "Untitled Link"}
                        </h4>
                      </div>

                      {/* Clicks Badge */}
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-semibold font-mono tabular-nums shrink-0">
                        <Icon.Activity size={13} className="shrink-0" />
                        <span>{item.timesClicked || 0}</span>
                        <span className="text-[10px] text-accent/80 font-sans uppercase">clicks</span>
                      </div>
                    </div>

                    {/* URLs Info */}
                    <div className="space-y-3 pt-1">
                      {/* Short URL Box */}
                      <div className="p-3 rounded-xl bg-surface/90 border border-accent/20 flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
                            Short Link
                          </span>
                          <a
                            href={item.shortLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-semibold text-accent hover:text-white transition-colors truncate block"
                            title={item.shortLink}
                          >
                            {item.shortLink.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleCopyShortLink(item.id, item.shortLink)}
                            title="Copy Short Link"
                            className={`p-2 rounded-lg transition-all ${
                              isCopied
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-white/5 hover:bg-white/15 text-white"
                            }`}
                          >
                            {isCopied ? <Icon.Check size={15} /> : <Icon.Copy size={15} />}
                          </button>
                          <a
                            href={item.shortLink}
                            target="_blank"
                            rel="noreferrer"
                            title="Open Link"
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-white transition-colors"
                          >
                            <Icon.ExternalLink size={15} />
                          </a>
                        </div>
                      </div>

                      {/* Destination URL */}
                      <div className="px-1">
                        <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-0.5">
                          Destination
                        </span>
                        <div className="flex items-center justify-between gap-2">
                          <a
                            id="long-url"
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-text-muted hover:text-white transition-colors truncate max-w-[85%]"
                            title={item.url}
                          >
                            {item.url}
                          </a>
                          <button
                            onClick={() => handleCopyDestLink(item.id, item.url)}
                            title="Copy Original URL"
                            className="text-text-muted hover:text-white p-1 rounded"
                          >
                            {isDestCopied ? (
                              <Icon.Check size={12} className="text-emerald-400" />
                            ) : (
                              <Icon.Copy size={12} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* QR Code Collapsible */}
                    {item.qrCodeData && (
                      <div className="mt-4 pt-3 border-t border-white/5">
                        <button
                          onClick={() => setExpandedQrId(isQrExpanded ? null : item.id)}
                          className="flex items-center justify-between w-full text-xs font-medium text-text-muted hover:text-white transition-colors py-1"
                        >
                          <span className="flex items-center gap-1.5">
                            <Icon.Camera size={14} className="text-accent" />
                            <span>{isQrExpanded ? "Hide QR Code" : "Show QR Code"}</span>
                          </span>
                          {isQrExpanded ? <Icon.ChevronUp size={14} /> : <Icon.ChevronDown size={14} />}
                        </button>

                        {isQrExpanded && (
                          <div className="mt-3 p-3 bg-surface/90 rounded-xl border border-white/10 flex flex-col items-center gap-3 animate-in fade-in duration-200">
                            <div className="p-2 bg-white rounded-lg shadow-md">
                              <img
                                src={item.qrCodeData}
                                alt={`QR Code for ${item.shortLink}`}
                                className="w-32 h-32"
                              />
                            </div>
                            <button
                              onClick={() => downloadQrCode(item.linkName, item.qrCodeData)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors"
                            >
                              <Icon.Download size={13} />
                              <span>Download QR</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Normal Card Actions */}
                  {!item.editUrls && !item.deleteConfirm && (
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5 text-xs">
                      <button
                        onClick={() => handleEditUrls(item.id, item.url)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-white/5 transition-colors"
                      >
                        <Icon.Edit3 size={15} />
                        <span>Edit Destination</span>
                      </button>
                      <button
                        onClick={() => handleDeleteConfirm(item.id)}
                        className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete Link"
                      >
                        <Icon.Trash size={16} />
                      </button>
                    </div>
                  )}

                  {/* Edit Destination Form */}
                  {item.editUrls && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-3 animate-in fade-in">
                      <label className="text-xs font-semibold text-text-muted block">
                        Edit Destination URL
                      </label>
                      <input
                        type="url"
                        id={`new-link-${item.id}`}
                        value={editingUrlValue[item.id] ?? item.url}
                        onChange={(e) =>
                          setEditingUrlValue((prev) => ({ ...prev, [item.id]: e.target.value }))
                        }
                        className="w-full bg-surface border border-white/15 p-2.5 rounded-xl text-white text-xs focus:outline-none focus:border-accent"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(item.id)}
                          className="flex-1 bg-accent text-black font-bold py-2 rounded-xl text-xs hover:bg-accent2 transition-colors"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => handleCancelEditUrls(item.id)}
                          className="px-3 py-2 bg-surface-light border border-white/10 text-text-muted rounded-xl hover:text-white text-xs transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Delete Confirmation Dialog */}
                  {item.deleteConfirm && (
                    <div className="mt-4 pt-4 border-t border-red-500/30 space-y-2.5 animate-in fade-in">
                      <p className="text-xs font-semibold text-red-400 text-center">
                        Delete this short link permanently?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteUrls(item.id)}
                          className="flex-1 bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30 hover:text-red-300 font-semibold py-2 rounded-xl text-xs transition-colors"
                        >
                          Confirm Delete
                        </button>
                        <button
                          onClick={() => handleCancelDelete(item.id)}
                          className="flex-1 bg-surface-light border border-white/10 text-text-muted rounded-xl hover:text-white text-xs transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  ) : (
    <Offline />
  );
};

export default Dashboard;
