import { useEffect, useMemo, useState } from "react";
import {
  Mail,
  Palette,
  Send,
  Save,
  Trash2,
  Download,
  LogOut,
  MessageSquare,
} from "lucide-react";
import type { AccountStats, HistoryItem, User, WishlistItem } from "./types";

type ProfileViewProps = {
  user?: User;
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenFeedback: () => void;
  onSaveProfile: (name: string, email: string) => Promise<void>;
  onDeleteAccount: () => Promise<void>;
  onLogout: () => void;
  accountStats: AccountStats;
  wishlistItems: WishlistItem[];
  travelHistoryItems: HistoryItem[];
};

const StatCard = ({ label, value }: { label: string; value: number }) => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-slate-900/50 px-4 py-3 shadow-sm">
      <p className="text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-slate-800 dark:text-white">
        {value}
      </p>
    </div>
  );
};

const ProfileView = ({
  user,
  darkMode,
  onToggleTheme,
  onOpenFeedback,
  onSaveProfile,
  onDeleteAccount,
  onLogout,
  accountStats,
  wishlistItems,
  travelHistoryItems,
}: ProfileViewProps) => {
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(
    null,
  );

  useEffect(() => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
  }, [user?.name, user?.email]);

  const accountDataExport = useMemo(() => {
    return {
      exported_at: new Date().toISOString(),
      user,
      stats: accountStats,
      wishlist: wishlistItems,
      travel_history: travelHistoryItems,
    };
  }, [accountStats, travelHistoryItems, user, wishlistItems]);

  const downloadMyData = () => {
    const blob = new Blob([JSON.stringify(accountDataExport, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "ghumphir-account-data.json";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    setStatusMessage(null);
    setStatusType(null);
    setIsSaving(true);
    try {
      await onSaveProfile(name, email);
      setStatusType("success");
      setStatusMessage("Profile updated successfully.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile.";
      setStatusType("error");
      setStatusMessage(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setStatusMessage(null);
    setStatusType(null);
    setIsDeleting(true);
    try {
      await onDeleteAccount();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete account.";
      setStatusType("error");
      setStatusMessage(message);
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-1 py-3 sm:px-2 md:px-3">
      <section className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/50 p-6 shadow-md">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          My Account
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
          Manage your profile, preferences, and account safety from one place.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Wishlist Items" value={accountStats.wishlistCount} />
          <StatCard label="Visited Places" value={accountStats.visitedCount} />
          <StatCard label="Reviews" value={accountStats.reviewCount} />
          <StatCard
            label="Chat Sessions"
            value={accountStats.chatSessionsCount}
          />
        </div>

        <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-slate-950/40 p-4">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Profile Information
            </h3>
            <div className="mt-4 space-y-3">
              <label className="block text-sm text-slate-600 dark:text-slate-300">
                Name
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </label>
              <label className="block text-sm text-slate-600 dark:text-slate-300">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </label>

              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
              >
                <Save size={16} />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-slate-950/40 p-4">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Preferences & Tools
            </h3>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={onToggleTheme}
                className="inline-flex items-center justify-between rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm font-medium text-slate-800 dark:text-white hover:border-sky-300 dark:hover:border-sky-300"
              >
                <span className="inline-flex items-center gap-2">
                  <Palette size={16} /> Theme
                </span>
                <span className="text-slate-500 dark:text-slate-300">
                  {darkMode ? "Dark" : "Light"}
                </span>
              </button>

              <button
                type="button"
                onClick={onOpenFeedback}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm font-medium text-slate-800 dark:text-white hover:border-sky-300 dark:hover:border-sky-300"
              >
                <MessageSquare size={16} />
                Send Feedback
              </button>

              <button
                type="button"
                onClick={downloadMyData}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm font-medium text-slate-800 dark:text-white hover:border-sky-300 dark:hover:border-sky-300"
              >
                <Download size={16} />
                Export My Data (.json)
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-amber-300/70 bg-amber-50 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-amber-100 dark:border-amber-700/70 dark:bg-amber-900/20 dark:text-amber-200"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          </div>
        </div>

        {statusMessage && (
          <p
            className={`mt-5 rounded-xl px-3 py-2 text-sm ${
              statusType === "success"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200"
            }`}
          >
            {statusMessage}
          </p>
        )}
      </section>

      <section className="mt-5 rounded-3xl border border-red-200 dark:border-red-700/50 bg-red-50/70 dark:bg-red-950/20 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-red-700 dark:text-red-300">
          Danger Zone
        </h3>
        <p className="mt-1 text-sm text-red-700/80 dark:text-red-300/80">
          Deleting your account permanently removes your profile, wishlist,
          travel history, and chat sessions.
        </p>

        {!showDeleteConfirm ? (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            <Trash2 size={16} />
            Delete My Account
          </button>
        ) : (
          <div className="mt-4 rounded-2xl border border-red-300 dark:border-red-700/70 bg-white dark:bg-slate-900 p-4">
            <p className="text-sm text-slate-700 dark:text-slate-200">
              This action cannot be undone. Are you sure?
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                <Trash2 size={15} />
                {isDeleting ? "Deleting..." : "Yes, delete permanently"}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="rounded-xl border border-slate-300 dark:border-white/15 px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="mt-5 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/50 p-6 shadow-sm">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
          Contact Email
        </h3>
        <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <Mail size={16} /> feedback@ghumphir.com
        </p>
        <button
          type="button"
          onClick={onOpenFeedback}
          className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-white/15 px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-sky-300"
        >
          <Send size={15} /> Open Feedback Draft
        </button>
      </section>
    </div>
  );
};

export default ProfileView;
