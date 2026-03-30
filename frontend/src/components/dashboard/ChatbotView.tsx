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

const ChatbotView = ({ userId }: ChatbotViewProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      text: "Hi! I can help you with places to visit in Nepal. Ask me about a specific place.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [pastChats, setPastChats] = useState<PastChat[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Fetch chat sessions from backend
  useEffect(() => {
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
    fetchSessions();
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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

      // Persist session ID for subsequent messages
      if (data.session_id && !selectedChatId) {
        const newSessionId = data.session_id.toString();
        setSelectedChatId(newSessionId);

        // Add new session to pastChats sidebar
        const newChat: PastChat = {
          id: newSessionId,
          title: trimmed.slice(0, 40),
        };
        setPastChats((prev) => [newChat, ...prev]);
      }

      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.reply || "Message saved." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Something went wrong. Please try again." },
      ]);
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
    setMessages([
      {
        role: "ai",
        text: "Hi! I can help you with places to visit in Nepal. Ask me about a specific place.",
      },
    ]);
    setInput("");
    setSelectedChatId(null);
  };

  const handleDeleteChat = async (chatId: string) => {
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
      }
    } catch (err) {
      console.error(err);
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
                    handleDeleteChat(chat.id);
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
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-bl-md px-4 py-3 text-sm bg-white dark:bg-gray-800 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-gray-700">
                  Thinking...
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
    </div>
  );
};

export default ChatbotView;
