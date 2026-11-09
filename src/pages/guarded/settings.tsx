// ****************** firebase imports
import {
  updateProfile,
  signOut,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import auth from "../../firebase/auth";

// ****************** React Hooks
import { useState } from "react";

// ****************** React Router
import { useNavigate } from "react-router-dom";

// ****************** Feather Icons
import * as Icon from "react-feather";

// ****************** Component Import
import Offline from "../../components/offline";
import Loader from "../../components/loader/loader";
import ErrorModal from "../../components/modals/errorModal";
import SuccessModal from "../../components/modals/successModal";

const Settings: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [authenticate, setAuthenticate] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [copiedUid, setCopiedUid] = useState(false);

  // ****************** get current user
  const user = auth.currentUser;
  const navigate = useNavigate();

  // ****************** handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setUserName(name);
  };

  // ****************** update user profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName || !userName.trim()) {
      setModalMessage("Please enter a username");
      setErrorModal(true);
      setTimeout(() => setErrorModal(false), 3000);
      return;
    }

    if (user) {
      setIsLoading(true);
      try {
        await updateProfile(user, {
          displayName: userName.trim(),
        });
        setIsLoading(false);
        setModalMessage("Profile username updated successfully");
        setSuccessModal(true);
        setTimeout(() => setSuccessModal(false), 3000);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
        setModalMessage("Failed to update profile. Please try again.");
        setErrorModal(true);
        setTimeout(() => setErrorModal(false), 3000);
      }
    }
  };

  // ****************** sign out user
  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      navigate("/signin");
    } catch (err) {
      console.error(err);
      navigate("/signin");
    } finally {
      setIsLoading(false);
    }
  };

  // ****************** Password reset
  const handleSendPasswordReset = async () => {
    if (!user?.email) return;
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      setIsLoading(false);
      setModalMessage(`Password reset link sent to ${user.email}`);
      setSuccessModal(true);
      setTimeout(() => setSuccessModal(false), 4000);
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      setModalMessage("Could not send password reset email. Please try again later.");
      setErrorModal(true);
      setTimeout(() => setErrorModal(false), 3000);
    }
  };

  // ****************** delete user account
  const authenticatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPassword = e.target.value;
    setAuthenticate(confirmPassword);
    setErrorModal(false);
  };

  const showDeleteModal = () => {
    setDeleteModal(true);
  };

  const handleDeleteUser = async (password: string) => {
    setIsLoading(true);
    const userEmail = user?.email ? user?.email : "";
    if (user) {
      const credential = EmailAuthProvider.credential(userEmail, password);
      try {
        await reauthenticateWithCredential(user, credential);
        await deleteUser(user);
        setIsLoading(false);
        navigate("/signin");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setIsLoading(false);
        const errorCode = error.code;

        if (errorCode === "auth/invalid-credential" || errorCode === "auth/wrong-password") {
          setErrorModal(true);
          setModalMessage("Wrong password. Please try again.");
        } else if (errorCode === "auth/network-request-failed") {
          setErrorModal(true);
          setModalMessage("Network error, please try again later.");
        } else {
          setErrorModal(true);
          setModalMessage("Authentication failed. Please check your credentials.");
        }
        setTimeout(() => setErrorModal(false), 4000);
      }
    }
  };

  const handleCopyUid = () => {
    if (user?.uid) {
      navigator.clipboard.writeText(user.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  const userInitials = (user?.displayName || user?.email || "U")
    .substring(0, 2)
    .toUpperCase();

  return navigator.onLine ? (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      {/* Toast Notifications */}
      <div
        className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          errorModal ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8 pointer-events-none"
        }`}
      >
        {errorModal && <ErrorModal error={modalMessage} />}
      </div>

      <div
        className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          successModal ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8 pointer-events-none"
        }`}
      >
        {successModal && <SuccessModal success={modalMessage} />}
      </div>

      {isLoading && <Loader />}

      {/* Header Section */}
      <div className="pb-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white tracking-tight">
            Welcome <span className="text-gradient">{user?.displayName ? user.displayName : "User"}</span>,
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Manage your personal profile, account credentials, and platform preferences.
          </p>
        </div>

        <button
          onClick={handleSignOut}
          data-testid="signout"
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-text-muted hover:text-white hover:bg-white/10 active:scale-95 transition-all text-sm font-semibold"
        >
          <Icon.LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Profile Overview Card */}
      <section className="glass-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-accent/30 via-accent/15 to-accent2/20 border-2 border-accent/40 flex items-center justify-center text-accent font-display font-extrabold text-2xl sm:text-3xl shrink-0 shadow-lg shadow-accent/10">
            {userInitials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white truncate">
                {user?.displayName || "Cuttr Member"}
              </h2>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                Active Account
              </span>
            </div>
            <p className="text-sm text-text-muted truncate mt-0.5">{user?.email || "No email attached"}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-text-muted/70 font-mono">UID:</span>
              <span className="text-xs text-text-muted font-mono truncate max-w-[140px] sm:max-w-[220px]">
                {user?.uid || "N/A"}
              </span>
              {user?.uid && (
                <button
                  onClick={handleCopyUid}
                  title="Copy User ID"
                  className="p-1 rounded text-text-muted hover:text-white transition-colors"
                >
                  {copiedUid ? (
                    <Icon.Check size={12} className="text-emerald-400" />
                  ) : (
                    <Icon.Copy size={12} />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Profile Information */}
        <section className="glass-card p-6 sm:p-7 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-xl bg-accent/10 text-accent">
                <Icon.User size={18} />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Profile Information</h3>
            </div>
            <p className="text-xs sm:text-sm text-text-muted mb-6">
              Update how your name appears across your shortened links and public redirects.
            </p>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="username" className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
                  Display Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    defaultValue={user?.displayName || ""}
                    placeholder={user?.displayName ? user.displayName : "Enter your username"}
                    className="w-full bg-surface border border-white/15 p-3.5 rounded-xl text-white text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-text-muted/40"
                    onChange={handleChange}
                  />
                </div>
                <p className="text-[11px] text-text-muted">
                  This will be shown on your dashboard greeting and generated link metadata.
                </p>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-accent text-black font-bold text-sm hover:bg-accent2 shadow-md shadow-accent/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Icon.Save size={16} />
                <span>Save Username</span>
              </button>
            </form>
          </div>
        </section>

        {/* Card 2: Account Email & Security */}
        <section className="glass-card p-6 sm:p-7 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-xl bg-accent/10 text-accent">
                <Icon.Shield size={18} />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Security & Password</h3>
            </div>
            <p className="text-xs sm:text-sm text-text-muted mb-6">
              Manage your authentication method and reset your password securely.
            </p>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
                  Account Email
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    name="email"
                    id="email"
                    value={user?.email || "No email available"}
                    className="w-full bg-surface/50 border border-white/10 p-3.5 rounded-xl text-text-muted text-sm cursor-not-allowed select-none"
                    disabled
                  />
                  <div className="absolute right-3 p-1 text-emerald-400 flex items-center gap-1 text-xs">
                    <Icon.CheckCircle size={14} />
                    <span className="hidden sm:inline">Verified</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface/70 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-white">Password Recovery</h4>
                  <p className="text-xs text-text-muted mt-0.5">
                    Send a secure password reset link to your registered email address.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSendPasswordReset}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold shrink-0 transition-colors"
                >
                  Send Reset Link
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Card 3: Platform Preferences */}
        <section className="glass-card p-6 sm:p-7 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-xl bg-accent/10 text-accent">
              <Icon.Sliders size={18} />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Shortener Preferences</h3>
          </div>
          <p className="text-xs sm:text-sm text-text-muted mb-6">
            Configure your default parameters for new link generations.
          </p>

          <div className="space-y-3.5">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface/60 border border-white/5">
              <div>
                <p className="text-sm font-semibold text-white">Default Domain</p>
                <p className="text-xs text-text-muted">Short links are generated under this domain</p>
              </div>
              <span className="text-xs font-mono font-medium text-accent bg-accent/10 px-2.5 py-1 rounded-lg border border-accent/20">
                cuttr.app
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface/60 border border-white/5">
              <div>
                <p className="text-sm font-semibold text-white">Click Analytics</p>
                <p className="text-xs text-text-muted">Real-time counter enabled on all slugs</p>
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                Enabled
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface/60 border border-white/5">
              <div>
                <p className="text-sm font-semibold text-white">QR Code Engine</p>
                <p className="text-xs text-text-muted">High-density dynamic QR generation</p>
              </div>
              <span className="text-xs font-semibold text-text-muted bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                Auto-generate
              </span>
            </div>
          </div>
        </section>

        {/* Card 4: Danger Zone */}
        <section className="glass-card p-6 sm:p-7 rounded-2xl border border-red-500/25 bg-red-950/[0.04] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-xl bg-red-500/15 text-red-400">
                <Icon.AlertTriangle size={18} />
              </div>
              <h3 className="font-display font-bold text-lg text-red-400">Danger Zone</h3>
            </div>
            <p className="text-xs sm:text-sm text-text-muted mb-6">
              Irreversible account actions. Please exercise caution before proceeding.
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-red-500/[0.05] border border-red-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white">Permanently Delete Account</h4>
                  <p className="text-xs text-text-muted mt-0.5">
                    This will delete your credentials and remove your user collection links.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={showDeleteModal}
                  className="px-4 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500 hover:text-white transition-all text-xs font-bold shrink-0 self-start sm:self-auto"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Delete Account Modal Dialog */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-red-500/30 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-500/30">
              <Icon.Trash2 size={24} />
            </div>

            <h3 className="text-xl font-display font-bold text-white text-center mb-1">
              Delete Your Account?
            </h3>
            <p className="text-sm text-text-muted text-center mb-6">
              This action is permanent and cannot be undone. Please confirm your password below to proceed.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (authenticate) {
                  handleDeleteUser(authenticate);
                } else {
                  setErrorModal(true);
                  setModalMessage("Please enter your password to confirm");
                  setTimeout(() => setErrorModal(false), 3000);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
                  Enter Account Password
                </label>
                <input
                  type="password"
                  onChange={authenticatePassword}
                  autoComplete="current-password"
                  placeholder="Your current password"
                  className="w-full bg-surface-light border border-white/15 p-3.5 rounded-xl text-white text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
                  autoFocus
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition-all"
                >
                  Yes, Delete Account
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  ) : (
    <Offline />
  );
};

export default Settings;
