import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bot,
  Edit,
  MoreVertical,
  Plus,
  SendHorizonal,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

type ChatRole = "ai" | "user";

type ChatMessage = {
  role: ChatRole;
  text: string;
};

type PastChat = {
  id: string;
  title: string;
};

type ChatbotViewProps = {
  userId?: number;
};

const defaultMessages: ChatMessage[] = [
  {
    role: "ai",
    text: "Hi! I can help you with places to visit in Nepal. Ask me about a specific place.",
  },
];

const normalizeReplyText = (reply: unknown): string => {
  if (typeof reply === "string") return reply;

  if (reply && typeof reply === "object") {
    const payload = reply as Record<string, unknown>;
    const candidate =
      payload.reply ?? payload.response ?? payload.message ?? payload.text;

    if (typeof candidate === "string") return candidate;
  }

  if (reply == null) return "Message saved.";

  try {
    return JSON.stringify(reply);
  } catch {
    return String(reply);
  }
};

const ChatbotView = ({ userId }: ChatbotViewProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(defaultMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isMobileHistoryOpen, setIsMobileHistoryOpen] = useState(false);
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);
  const [pendingDeleteChat, setPendingDeleteChat] = useState<PastChat | null>(
    null,
  );
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [pastChats, setPastChats] = useState<PastChat[]>([]);
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
  const [renameText, setRenameText] = useState("");
  const [openMenuChatId, setOpenMenuChatId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const fetchSessions = useCallback(async () => {
    if (!userId) return;

    try {
      const res = await fetch("http://localhost:9000/api/sessions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) return;

      const data = await res.json();
      const formattedChats: PastChat[] = data.map(
        (session: { session_id: number; title: string }) => ({
          id: session.session_id.toString(),
          title: session.title,
        }),
      );

      setPastChats(formattedChats);
    } catch (error) {
      console.error(error);
    }
  }, [userId]);

  useEffect(() => {
    void fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const fetchSessionMessages = async () => {
      if (!userId || !selectedChatId) {
        setMessages(defaultMessages);
        return;
      }

      setLoadingHistory(true);
      try {
        const res = await fetch(
          `http://localhost:9000/api/sessions/${selectedChatId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (!res.ok) {
          throw new Error("Failed to fetch selected chat messages.");
        }

        const data = await res.json();
        const formatted: ChatMessage[] = Array.isArray(data)
          ? data.map((item: { sender: string; message: string }) => ({
              role: item.sender === "user" ? "user" : "ai",
              text: item.message,
            }))
          : [];

        setMessages(formatted.length ? formatted : defaultMessages);
      } catch (error) {
        const fallback =
          error instanceof Error && error.message
            ? error.message
            : "Something went wrong while loading the chat.";
        setMessages([{ role: "ai", text: fallback }]);
      } finally {
        setLoadingHistory(false);
      }
    };

    void fetchSessionMessages();
  }, [selectedChatId, userId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-menu-container]")) {
        setOpenMenuChatId(null);
      }
    };

    if (openMenuChatId) {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [openMenuChatId]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    if (!userId) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Please log in first so I can save this chat session.",
        },
      ]);
      return;
    }

    const userMessage: ChatMessage = { role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const sessionId = selectedChatId ?? null;
      const res = await fetch("http://localhost:9000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          session_id: sessionId || null,
          message: trimmed,
        }),
      });

      const data = await res.json();

      if (res.status === 401 && data?.code === "TOKEN_USER_NOT_FOUND") {
        localStorage.removeItem("token");
        throw new Error("Your session is out of sync. Please log in again.");
      }

      if (!res.ok || data?.success === false) {
        const errorMessage =
          typeof data?.error === "string"
            ? data.error
            : "Failed to get a response from the assistant.";
        throw new Error(errorMessage);
      }

      if (data.session_id && !selectedChatId) {
        const newSessionId = data.session_id.toString();
        setSelectedChatId(newSessionId);
        await fetchSessions();
      }

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: normalizeReplyText(data.reply) },
      ]);
    } catch (error) {
      const fallback =
        error instanceof Error && error.message
          ? error.message
          : "Something went wrong. Please try again.";
      setMessages((prev) => [...prev, { role: "ai", text: fallback }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  const handleNewChat = () => {
    setMessages(defaultMessages);
    setInput("");
    setSelectedChatId(null);
    setIsMobileHistoryOpen(false);
  };

  const handleDeleteChat = async (chatId: string) => {
    setDeletingChatId(chatId);
    try {
      await fetch(`http://localhost:9000/api/sessions/${chatId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setPastChats((prev) => prev.filter((chat) => chat.id !== chatId));
      if (selectedChatId === chatId) {
        setSelectedChatId(null);
        setMessages(defaultMessages);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingChatId(null);
      setPendingDeleteChat(null);
    }
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setIsMobileHistoryOpen(false);
  };

  const handleRenameChat = async (chatId: string) => {
    if (!renameText.trim()) {
      setRenamingChatId(null);
      return;
    }

    try {
      const res = await fetch(`http://localhost:9000/api/sessions/${chatId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title: renameText.trim() }),
      });

      if (res.ok) {
        setPastChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId ? { ...chat, title: renameText.trim() } : chat,
          ),
        );
        setRenamingChatId(null);
        setRenameText("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStartRename = (event: React.MouseEvent, chat: PastChat) => {
    event.stopPropagation();
    setRenamingChatId(chat.id);
    setRenameText(chat.title);
  };

  const historyPanel = () => (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0 border-b border-white/10 bg-white/5 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Recent Chats
            </p>
            <h3 className="mt-1 text-lg font-semibold text-white">
              Conversation History
            </h3>
          </div>

          <button
            type="button"
            onClick={handleNewChat}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
          >
            <Plus size={16} />
            New
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2 dashboard-scrollbar">
        {pastChats.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-6 text-sm text-slate-300">
            No saved chats yet.
          </div>
        ) : (
          pastChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleSelectChat(chat.id)}
              className={`rounded-2xl border px-3 py-3 cursor-pointer transition ${
                selectedChatId === chat.id
                  ? "border-sky-400/40 bg-sky-500/20"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                {renamingChatId === chat.id ? (
                  <input
                    type="text"
                    value={renameText}
                    onChange={(e) => setRenameText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        void handleRenameChat(chat.id);
                      } else if (e.key === "Escape") {
                        setRenamingChatId(null);
                        setRenameText("");
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 rounded-xl border border-sky-400/40 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none focus:border-sky-300"
                    autoFocus
                  />
                ) : (
                  <p
                    className={`flex-1 line-clamp-1 text-sm font-semibold ${
                      selectedChatId === chat.id
                        ? "text-white"
                        : "text-slate-100"
                    }`}
                  >
                    {chat.title}
                  </p>
                )}

                {!renamingChatId && (
                  <div className="relative" data-menu-container>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuChatId(
                          openMenuChatId === chat.id ? null : chat.id,
                        );
                      }}
                      className="rounded-lg p-1 text-slate-300 transition hover:bg-white/10"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {openMenuChatId === chat.id && (
                      <div className="absolute right-0 top-8 z-50 min-w-32 overflow-hidden rounded-xl border border-white/10 bg-slate-950 shadow-xl">
                        <button
                          onClick={(e) => handleStartRename(e, chat)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-sky-200 hover:bg-white/10"
                        >
                          <Edit size={14} />
                          Rename
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPendingDeleteChat(chat);
                            setOpenMenuChatId(null);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-300 hover:bg-white/10"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full h-full min-h-0 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="min-w-0 flex-1 truncate text-2xl font-semibold leading-none tracking-tight text-sky-900 dark:text-sky-400 sm:text-3xl">
          Nepal Travel Chatbot
        </h2>

        <button
          type="button"
          onClick={() => setIsMobileHistoryOpen(true)}
          className="lg:hidden shrink-0 rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-white/5 dark:text-slate-200 sm:px-3.5 sm:py-2.5 sm:text-sm"
        >
          History
        </button>
      </div>

      <div className="flex-1 min-h-0 grid gap-4 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <section className="min-h-[calc(100dvh-12rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md flex flex-col dark:border-gray-700 dark:bg-gray-800 sm:min-h-[calc(100dvh-10rem)] lg:min-h-0">
          <div className="shrink-0 bg-sky-600 px-4 py-4 text-white sm:px-5">
            <p className="font-semibold">Ask about any place in Nepal</p>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto bg-slate-50 p-4 space-y-3 dashboard-scrollbar dark:bg-gray-900/60 sm:p-5">
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm sm:text-[15px] leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "rounded-br-md bg-sky-600 text-white"
                      : "rounded-bl-md border border-slate-200 bg-white text-slate-800 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-100"
                  }`}
                >
                  <div className="mb-1.5 flex items-center gap-2 text-xs opacity-80">
                    {msg.role === "user" ? (
                      <UserIcon size={14} />
                    ) : (
                      <Bot size={14} />
                    )}
                    <span>
                      {msg.role === "user" ? "You" : "Travel Assistant"}
                    </span>
                  </div>

                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <p className="mb-2 last:mb-0">{children}</p>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold">{children}</strong>
                      ),
                      ul: ({ children }) => (
                        <ul className="mt-1 list-inside list-disc space-y-1">
                          {children}
                        </ul>
                      ),
                      li: ({ children }) => (
                        <li className="text-sm leading-relaxed">{children}</li>
                      ),
                    }}
                  >
                    {typeof msg.text === "string" ? msg.text : String(msg.text)}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {(loading || loadingHistory) && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-slate-300">
                  {loadingHistory ? "Loading chat..." : "Thinking..."}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="shrink-0 border-t border-slate-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="relative flex items-center">
              <input
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 pr-14 py-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-gray-600 dark:bg-gray-900 dark:text-slate-100"
                placeholder="Ask about a place in Nepal..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                type="button"
                onClick={() => void sendMessage()}
                disabled={loading}
                className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-transparent text-sky-500 transition hover:text-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
                aria-label="Send message"
                title="Send message"
              >
                <SendHorizonal size={16} />
              </button>
            </div>
          </div>
        </section>

        <aside className="hidden min-h-0 overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 shadow-[0_18px_40px_rgba(2,8,23,0.4)] lg:flex">
          {historyPanel()}
        </aside>
      </div>

      {isMobileHistoryOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close chat history"
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            onClick={() => setIsMobileHistoryOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-[88vw] max-w-sm">
            <aside className="h-full overflow-hidden border-l border-white/10 bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 shadow-2xl">
              {historyPanel()}
            </aside>
          </div>
        </div>
      )}

      {pendingDeleteChat && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-chat-title"
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800">
            <div className="border-b border-slate-200 px-6 py-5 dark:border-gray-700">
              <h3
                id="delete-chat-title"
                className="text-lg font-semibold text-slate-900 dark:text-slate-100"
              >
                Delete this chat?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                This will permanently remove
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  {` "${pendingDeleteChat.title}" `}
                </span>
                and all of its messages.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 bg-slate-50 px-6 py-4 dark:bg-gray-900/50">
              <button
                type="button"
                onClick={() => setPendingDeleteChat(null)}
                disabled={deletingChatId === pendingDeleteChat.id}
                className="rounded-xl border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:text-slate-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleDeleteChat(pendingDeleteChat.id)}
                disabled={deletingChatId === pendingDeleteChat.id}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Trash2 size={15} />
                {deletingChatId === pendingDeleteChat.id
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotView;
