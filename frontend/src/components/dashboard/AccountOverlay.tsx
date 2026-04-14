import { useEffect, useMemo, useState } from "react";
import {
  Camera,
  Download,
  Save,
  Settings,
  Trash2,
  X,
  Pencil,
  MessageSquare,
  LogOut,
} from "lucide-react";
import type { AccountStats, HistoryItem, User, WishlistItem } from "./types";

type ReportType = "bug" | "feedback" | "feature_requests";

type PublicReport = {
  report_id: number;
  type: ReportType;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  created_at: string;
  is_mine: boolean;
};

type AccountOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
  darkMode: boolean;
  onToggleTheme: () => void;
  onSaveProfile: (name: string, email: string) => Promise<void>;
  onDeleteAccount: () => Promise<void>;
  onLogout: () => void;
  onUploadProfileImage: (file: File) => Promise<void>;
  onSubmitReport: (type: ReportType, message: string) => Promise<void>;
  accountStats: AccountStats;
  wishlistItems: WishlistItem[];
  travelHistoryItems: HistoryItem[];
  preview: string | null;
};

const AccountOverlay = ({
  isOpen,
  onClose,
  user,
  darkMode,
  onToggleTheme,
  onSaveProfile,
  onDeleteAccount,
  onLogout,
  onUploadProfileImage,
  onSubmitReport,
  accountStats,
  wishlistItems,
  travelHistoryItems,
  preview,
}: AccountOverlayProps) => {
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reportType, setReportType] = useState<ReportType>("feedback");
  const [reportMessage, setReportMessage] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(
    null,
  );
  const [feedbackStatusMessage, setFeedbackStatusMessage] = useState<
    string | null
  >(null);
  const [feedbackStatusType, setFeedbackStatusType] = useState<
    "success" | "error" | null
  >(null);
  const [communityReports, setCommunityReports] = useState<PublicReport[]>([]);
  const [communityTypeFilter, setCommunityTypeFilter] = useState<
    ReportType | "all"
  >("all");
  const [communitySearch, setCommunitySearch] = useState("");
  const [communityMineOnly, setCommunityMineOnly] = useState(false);
  const [isLoadingCommunityReports, setIsLoadingCommunityReports] =
    useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setIsEditMode(false);
    setShowDeleteConfirm(false);
    setStatusMessage(null);
    setStatusType(null);
    setFeedbackStatusMessage(null);
    setFeedbackStatusType(null);
  }, [isOpen, user?.email, user?.name]);

  useEffect(() => {
    if (!statusMessage) return;

    const timeoutId = window.setTimeout(() => {
      setStatusMessage(null);
      setStatusType(null);
    }, 10000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [statusMessage]);

  useEffect(() => {
    if (!feedbackStatusMessage) return;

    const timeoutId = window.setTimeout(() => {
      setFeedbackStatusMessage(null);
      setFeedbackStatusType(null);
    }, 10000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [feedbackStatusMessage]);

  useEffect(() => {
    if (!isOpen) return;
    void fetchCommunityReports();
  }, [isOpen]);

  const exportPayload = useMemo(
    () => ({
      exported_at: new Date().toISOString(),
      user,
      stats: accountStats,
      wishlist: wishlistItems,
      travel_history: travelHistoryItems,
    }),
    [accountStats, travelHistoryItems, user, wishlistItems],
  );

  if (!isOpen) return null;

  const downloadMyData = () => {
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
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

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setStatusMessage(null);
    try {
      await onSaveProfile(name, email);
      setStatusType("success");
      setStatusMessage("Profile updated successfully.");
      setIsEditMode(false);
    } catch (error) {
      setStatusType("error");
      setStatusMessage(
        error instanceof Error ? error.message : "Failed to update profile.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setIsEditMode(false);
    setStatusMessage(null);
    setStatusType(null);
  };

  const handleProfilePhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    setStatusMessage(null);
    try {
      await onUploadProfileImage(file);
      setStatusType("success");
      setStatusMessage("Profile picture updated.");
    } catch (error) {
      setStatusType("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Failed to upload profile photo.",
      );
    } finally {
      setIsUploadingPhoto(false);
      event.target.value = "";
    }
  };

  const handleReportSubmit = async () => {
    if (!reportMessage.trim()) {
      setFeedbackStatusType("error");
      setFeedbackStatusMessage("Please add your feedback message.");
      return;
    }

    setIsSubmittingReport(true);
    setFeedbackStatusMessage(null);
    try {
      await onSubmitReport(reportType, reportMessage.trim());
      setFeedbackStatusType("success");
      setFeedbackStatusMessage("Report submitted successfully.");
      setReportMessage("");
      setReportType("feedback");
      await fetchCommunityReports();
    } catch (error) {
      setFeedbackStatusType("error");
      setFeedbackStatusMessage(
        error instanceof Error ? error.message : "Failed to submit report.",
      );
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const fetchCommunityReports = async () => {
    setIsLoadingCommunityReports(true);
    try {
      const query = new URLSearchParams();
      if (communityTypeFilter !== "all") {
        query.set("type", communityTypeFilter);
      }
      if (communitySearch.trim()) {
        query.set("search", communitySearch.trim());
      }
      if (communityMineOnly) {
        query.set("mine", "true");
      }

      const token = localStorage.getItem("token");
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `http://localhost:9000/api/reports/public?${query.toString()}`,
        { headers },
      );
      const data = await response.json().catch(() => []);

      if (!response.ok) {
        throw new Error(data.message || "Failed to load community reports");
      }

      setCommunityReports(Array.isArray(data) ? data : []);
    } catch (error) {
      setFeedbackStatusType("error");
      setFeedbackStatusMessage(
        error instanceof Error
          ? error.message
          : "Failed to load community reports.",
      );
    } finally {
      setIsLoadingCommunityReports(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setStatusMessage(null);
    try {
      await onDeleteAccount();
    } catch (error) {
      setStatusType("error");
      setStatusMessage(
        error instanceof Error ? error.message : "Failed to delete account.",
      );
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-70 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[82vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-[#0f172a]/95 px-5 py-4 backdrop-blur">
          <h2 className="text-lg font-semibold">My Account</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        <main className="p-5 md:p-6 space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Wishlist" value={accountStats.wishlistCount} />
            <Stat label="Visited" value={accountStats.visitedCount} />
            <Stat label="Reviews" value={accountStats.reviewCount} />
            <Stat label="AI Chats" value={accountStats.chatSessionsCount} />
          </div>

          <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1220] p-4">
            <h4 className="text-lg font-semibold">Profile Information</h4>
            <div className="mt-4 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex flex-col items-center gap-2 md:w-34 md:shrink-0">
                <img
                  src={
                    preview ||
                    (user?.profile_image
                      ? `http://localhost:9000${user.profile_image}`
                      : "https://placehold.co/96x96/1e293b/e2e8f0?text=U")
                  }
                  alt="Profile"
                  className="h-20 w-20 rounded-full object-cover border border-slate-400 dark:border-slate-600"
                />
                {isEditMode && (
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-400 dark:border-slate-600 px-3 py-1.5 text-xs hover:bg-slate-200 dark:hover:bg-slate-800">
                    <Camera size={14} />
                    {isUploadingPhoto ? "Uploading..." : "Change Picture"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => void handleProfilePhotoChange(event)}
                      disabled={isUploadingPhoto}
                    />
                  </label>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 flex-1">
                <label className="text-sm text-slate-700 dark:text-slate-300">
                  Name
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditMode}
                    className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3 py-2 disabled:opacity-70"
                  />
                </label>
                <label className="text-sm text-slate-700 dark:text-slate-300">
                  Email
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditMode}
                    className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3 py-2 disabled:opacity-70"
                  />
                </label>

                {!isEditMode ? (
                  <button
                    type="button"
                    onClick={() => setIsEditMode(true)}
                    className="inline-flex w-fit items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => void handleSaveProfile()}
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
                    >
                      <Save size={15} />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="rounded-lg border border-red-500/70 bg-red-900/20 px-4 py-2 text-sm font-medium text-red-200 hover:bg-red-900/30"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {statusMessage && (
                  <p
                    className={`rounded-lg px-3 py-2 text-sm ${
                      statusType === "success"
                        ? "bg-emerald-900/40 text-emerald-200"
                        : "bg-red-900/40 text-red-200"
                    }`}
                  >
                    {statusMessage}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1220] p-4">
            <h4 className="text-lg font-semibold">Preferences & Tools</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onToggleTheme}
                className="rounded-lg border border-slate-200 dark:border-slate-600 px-3.5 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <span className="inline-flex items-center gap-2">
                  <Settings size={15} /> Theme: {darkMode ? "Dark" : "Light"}
                </span>
              </button>

              <button
                type="button"
                onClick={downloadMyData}
                className="rounded-lg border border-slate-200 dark:border-slate-600 px-3.5 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <span className="inline-flex items-center gap-2">
                  <Download size={15} /> Export My Data (.json)
                </span>
              </button>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1220] p-4">
            <h4 className="text-lg font-semibold">Send Feedback</h4>
            <div className="mt-3 grid grid-cols-1 gap-3">
              <label className="text-sm text-slate-700 dark:text-slate-300">
                Report Type
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as ReportType)}
                  className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2"
                >
                  <option value="feedback">Feedback</option>
                  <option value="bug">Bug</option>
                  <option value="feature_requests">Feature Request</option>
                </select>
              </label>
              <label className="text-sm text-slate-700 dark:text-slate-300">
                Message
                <textarea
                  rows={4}
                  value={reportMessage}
                  onChange={(e) => setReportMessage(e.target.value)}
                  placeholder="Tell us what happened or what you want improved..."
                  className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2"
                />
              </label>
              <button
                type="button"
                onClick={() => void handleReportSubmit()}
                disabled={isSubmittingReport}
                className="inline-flex w-fit items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
              >
                <MessageSquare size={15} />
                {isSubmittingReport ? "Sending..." : "Submit"}
              </button>

              {feedbackStatusMessage && (
                <p
                  className={`rounded-lg px-3 py-2 text-sm ${
                    feedbackStatusType === "success"
                      ? "bg-emerald-900/40 text-emerald-200"
                      : "bg-red-900/40 text-red-200"
                  }`}
                >
                  {feedbackStatusMessage}
                </p>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1220] p-4">
            <div className="flex flex-col gap-3">
              <h4 className="text-lg font-semibold">
                Community Feedback Tracker
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[180px_minmax(220px,1fr)_auto_auto] gap-2 w-full">
                <select
                  value={communityTypeFilter}
                  onChange={(e) =>
                    setCommunityTypeFilter(e.target.value as ReportType | "all")
                  }
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="feedback">Feedback</option>
                  <option value="bug">Bug</option>
                  <option value="feature_requests">Feature Request</option>
                </select>

                <input
                  type="text"
                  value={communitySearch}
                  onChange={(e) => setCommunitySearch(e.target.value)}
                  placeholder="Search feedback text"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
                />

                <label className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={communityMineOnly}
                    onChange={(e) => setCommunityMineOnly(e.target.checked)}
                  />
                  My feedback only
                </label>

                <button
                  type="button"
                  onClick={() => void fetchCommunityReports()}
                  className="rounded-lg bg-sky-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-sky-700"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {isLoadingCommunityReports ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Loading reports...
                </p>
              ) : communityReports.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No reports found for the selected filters.
                </p>
              ) : (
                communityReports.map((report) => (
                  <article
                    key={report.report_id}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/70 p-3"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-sky-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300">
                        About: {report.type.replace("_", " ")}
                      </span>
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-amber-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300">
                        Status: {report.status.replace("_", " ")}
                      </span>
                      {report.is_mine && (
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-emerald-700 dark:border-emerald-600/70 dark:bg-slate-900 dark:text-emerald-200">
                          My report
                        </span>
                      )}
                      <span className="w-full sm:w-auto sm:ml-auto text-slate-500 dark:text-slate-400 sm:text-right">
                        {new Date(report.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                      {report.message}
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="rounded-xl border border-red-300 dark:border-red-700/60 bg-white dark:bg-red-950/20 p-4">
            <h4 className="text-lg font-semibold text-red-700 dark:text-red-300">
              Danger Zone
            </h4>
            <p className="mt-2 text-sm text-red-700/90 dark:text-red-200/90">
              Deleting your account permanently removes profile, wishlist,
              travel history, chats, and reports.
            </p>

            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                <Trash2 size={15} /> Delete My Account
              </button>
            ) : (
              <div className="mt-4 rounded-lg border border-red-300 dark:border-red-700 bg-white dark:bg-slate-900 p-3">
                <p className="text-sm text-slate-800 dark:text-slate-200">
                  This action cannot be undone.
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => void handleDeleteAccount()}
                    disabled={isDeleting}
                    className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                  >
                    {isDeleting ? "Deleting..." : "Confirm Delete"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    className="rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50 dark:border-amber-600/60 dark:bg-amber-900/20 dark:text-amber-200 dark:hover:bg-amber-900/30"
              >
                <LogOut size={15} /> Log Out
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1220] px-3 py-2">
      <p className="text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

export default AccountOverlay;
