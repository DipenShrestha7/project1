import { useEffect, useRef, useState } from "react";
import {
  Bot,
  SendHorizonal,
  User as UserIcon,
  Plus,
  Trash2,
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
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);
  const [pendingDeleteChat, setPendingDeleteChat] = useState<PastChat | null>(
    null,
  );
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [pastChats, setPastChats] = useState<PastChat[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Function to fetch chat sessions from backend
  const fetchSessions = async () => {
    if (!userId) return;
    try {
      const res = await fetch("http://localhost:9000/api/sessions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        const formattedChats: PastChat[] = data.map(
          (session: { session_id: number; title: string }) => ({
            id: session.session_id.toString(),
            title: session.title,
          }),
        );
        setPastChats(formattedChats);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch chat sessions from backend on component mount
  useEffect(() => {
    fetchSessions();
  }, [userId]);

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

    const userMsg: ChatMessage = { role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
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
          user_id: userId,
          session_id: sessionId || null,
          message: trimmed,
        }),
      });
      const data = await res.json();

      if (!res.ok || data?.success === false) {
        const errorMessage =
          typeof data?.error === "string"
            ? data.error
            : "Failed to get a response from the assistant.";
        throw new Error(errorMessage);
      }

      // Persist session ID for subsequent messages
      if (data.session_id && !selectedChatId) {
        const newSessionId = data.session_id.toString();
        setSelectedChatId(newSessionId);

        // Refetch sessions to ensure sidebar shows the new chat
        await fetchSessions();
      }

      // Add AI response to chat
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
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingChatId(null);
      setPendingDeleteChat(null);
    }
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    // Will show the chat messages when backend is integrated
  };

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <h2 className="text-3xl font-semibold text-sky-900 dark:text-sky-400">
        Nepal Travel Chatbot
      </h2>

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Sidebar - Past Chats */}
        <div className="w-64 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl shadow-md flex flex-col overflow-hidden">
          <button
            onClick={handleNewChat}
            className="m-3 flex items-center justify-center gap-2 px-4 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition shrink-0"
          >
            <Plus size={18} />
            New Chat
          </button>

          <div className="border-t border-slate-200 dark:border-gray-700" />

          <div className="flex-1 overflow-y-auto p-3 space-y-2 dashboard-scrollbar">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-2 py-1">
              RECENT CHATS
            </p>
            {pastChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={`p-3 rounded-lg cursor-pointer transition group ${
                  selectedChatId === chat.id
                    ? "bg-sky-100 dark:bg-sky-700/40"
                    : "hover:bg-slate-100 dark:hover:bg-gray-700/60"
                }`}
              >
                <p
                  className={`text-sm font-semibold line-clamp-1 ${
                    selectedChatId === chat.id
                      ? "text-sky-700 dark:text-sky-300"
                      : "text-slate-800 dark:text-slate-200"
                  }`}
                >
                  {chat.title}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPendingDeleteChat(chat);
                  }}
                  className="mt-2 opacity-0 group-hover:opacity-100 transition flex items-center gap-1 text-xs text-red-600 dark:text-red-400 hover:text-red-700"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl shadow-md overflow-hidden flex flex-col">
          <div className="px-5 py-4 bg-sky-600 text-white shrink-0">
            <p className="font-semibold">Ask about any place in Nepal</p>
            <p className="text-sm text-sky-100">
              Powered by Google ADK + Gemini
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-slate-50 dark:bg-gray-900/60 space-y-3 dashboard-scrollbar">
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm sm:text-[15px] leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-sky-600 text-white rounded-br-md"
                      : "bg-white dark:bg-gray-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-gray-700 rounded-bl-md"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5 text-xs opacity-80">
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
                        <ul className="list-disc list-inside space-y-1 mt-1">
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
                <div className="max-w-[85%] rounded-2xl rounded-bl-md px-4 py-3 text-sm bg-white dark:bg-gray-800 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-gray-700">
                  {loadingHistory ? "Loading chat..." : "Thinking..."}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center gap-2 shrink-0">
            <input
              className="flex-1 rounded-xl border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100 px-4 py-2.5 outline-none focus:ring-2 focus:ring-sky-500/40"
              placeholder="Ask about a place in Nepal..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              onClick={() => void sendMessage()}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70 transition"
            >
              <SendHorizonal size={16} />
              Send
            </button>
          </div>
        </div>
      </div>

      {pendingDeleteChat && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 backdrop-blur-sm px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-chat-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-gray-700">
              <h3
                id="delete-chat-title"
                className="text-lg font-semibold text-slate-900 dark:text-slate-100"
              >
                Delete this chat?
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                This will permanently remove
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  {` "${pendingDeleteChat.title}" `}
                </span>
                and all of its messages.
              </p>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-gray-900/50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingDeleteChat(null)}
                disabled={deletingChatId === pendingDeleteChat.id}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-100 dark:hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleDeleteChat(pendingDeleteChat.id)}
                disabled={deletingChatId === pendingDeleteChat.id}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed transition"
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
