import { useEffect, useRef, useState } from "react";

import {
  Send,
  Plus,
  MessageSquare,
  PanelLeft,
  FileText,
  Bot,
  LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import ReactMarkdown from "react-markdown";

import API from "../services/api";


interface Message {
  role: "user" | "assistant";
  content: string;
  fileName?: string;
  agent?: string;
  sources?: string[];
}


interface ChatSession {
  id: number;
  title: string;
}


function Dashboard() {

  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);

  const [loading, setLoading] = useState(false);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [sessions, setSessions] = useState<
    ChatSession[]
  >([]);

  const [sessionId, setSessionId] =
    useState<number | null>(null);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);


  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);


  useEffect(() => {
    fetchSessions();
  }, []);


  const fetchSessions = async () => {

    try {

      const response = await API.get(
        "/sessions/"
      );

      setSessions(response.data);

    } catch (error) {

      console.log(error);

    }
  };


  const createNewSession = async () => {

    try {

      const response = await API.post(
        "/sessions/create/"
      );

      const newSessionId =
        response.data.session_id;

      setSessionId(newSessionId);

      setMessages([]);

      setQuery("");

      setSelectedFile(null);

      fetchSessions();

      return newSessionId;

    } catch (error) {

      console.log(error);

      return null;
    }
  };


  const loadSession = async (
    session: ChatSession
  ) => {

    try {

      const response = await API.get(
        `/sessions/${session.id}/`
      );

      setSessionId(session.id);

      setMessages(response.data);

    } catch (error) {

      console.log(error);

    }
  };


  const logout = () => {

    localStorage.removeItem("access");

    localStorage.removeItem("refresh");

    navigate("/login");
  };


  const uploadFile = async (
    currentSessionId: number
  ) => {

    if (!selectedFile) return;

    const formData = new FormData();

    formData.append(
      "file",
      selectedFile
    );

    formData.append(
      "session_id",
      String(currentSessionId)
    );

    try {

      await API.post(
        "/upload/",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    } catch (error) {

      console.log(error);

    }
  };


  const sendMessage = async () => {

    if (!query.trim()) return;

    let currentSessionId = sessionId;

    if (!currentSessionId) {

      currentSessionId =
        await createNewSession();

      if (!currentSessionId) return;
    }

    const userMessage: Message = {
      role: "user",
      content: query,
      fileName: selectedFile?.name,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setLoading(true);

    try {

      if (selectedFile) {

        await uploadFile(
          currentSessionId
        );
      }

      const response = await API.post(
        "/chat/",
        {
          query,
          session_id:
            currentSessionId,
        }
      );

      const assistantMessage: Message = {
        role: "assistant",
        content:
          response.data.response,
        agent:
          response.data.agent,
        sources:
          response.data.sources,
      };

      setMessages((prev) => [
        ...prev,
        assistantMessage,
      ]);

      fetchSessions();

    } catch (error) {

      console.log(error);

    }

    setQuery("");

    setSelectedFile(null);

    setLoading(false);
  };


  const newChat = () => {

    setMessages([]);

    setSessionId(null);

    setQuery("");

    setSelectedFile(null);
  };


  return (
    <div className="h-screen bg-black text-white flex overflow-hidden">

      {/* SIDEBAR */}

      <div className="w-[270px] bg-zinc-950 border-r border-zinc-900 flex flex-col">

        <div className="h-16 border-b border-zinc-900 flex items-center px-5">

          <div className="flex items-center gap-3">

            <Bot className="text-blue-500" />

            <h1 className="text-xl font-bold">
              OpsPilot AI
            </h1>

          </div>

        </div>


        <div className="p-4">

          <button
            onClick={newChat}
            className="w-full flex items-center gap-3 bg-zinc-900 hover:bg-zinc-800 transition rounded-2xl p-4"
          >

            <Plus size={18} />

            <span>New Chat</span>

          </button>

        </div>


        <div className="flex-1 overflow-y-auto px-3 pb-4">

          <p className="text-xs text-zinc-500 px-3 mb-3">
            RECENT CHATS
          </p>

          <div className="space-y-2">

            {sessions.map((session) => (

              <div
                key={session.id}
                onClick={() =>
                  loadSession(session)
                }
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                  session.id === sessionId
                    ? "bg-zinc-800"
                    : "hover:bg-zinc-900"
                }`}
              >

                <MessageSquare size={18} />

                <span className="text-sm text-zinc-300 truncate">
                  {session.title}
                </span>

              </div>

            ))}

          </div>

        </div>


        <div className="border-t border-zinc-900 p-4">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">

                R

              </div>

              <div>

                <p className="font-medium">
                  Rishuv
                </p>

                <p className="text-xs text-zinc-500">
                  AI Engineer
                </p>

              </div>

            </div>

            <button
              onClick={logout}
              className="hover:bg-zinc-800 p-2 rounded-lg transition"
            >
              <LogOut size={18} />
            </button>

          </div>

        </div>

      </div>


      {/* MAIN */}

      <div className="flex-1 flex flex-col bg-black">

        <div className="h-16 border-b border-zinc-900 flex items-center px-6">

          <div className="flex items-center gap-4">

            <PanelLeft size={20} />

            <h1 className="text-lg font-semibold">
              Multi-Agent AI Workspace
            </h1>

          </div>

        </div>


        {/* CHAT AREA */}

        <div className="flex-1 overflow-y-auto">

          {messages.length === 0 ? (

            <div className="h-full flex flex-col items-center justify-center px-6">

              <div className="w-20 h-20 rounded-3xl bg-zinc-900 flex items-center justify-center mb-8">

                <Bot size={42} />

              </div>

              <h1 className="text-5xl font-bold mb-5 text-center">

                OpsPilot AI

              </h1>

              <p className="text-zinc-400 text-lg text-center max-w-2xl leading-relaxed">

                Upload enterprise documents,
                analyze operational workflows,
                and interact with AI-powered
                multi-agent systems.

              </p>

            </div>

          ) : (

            <div className="max-w-5xl mx-auto w-full py-10 px-6 space-y-8">

              {messages.map((message, index) => (

                <div
                  key={index}
                  className={`flex ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`max-w-3xl rounded-3xl px-6 py-5 ${
                      message.role === "user"
                        ? "bg-blue-600"
                        : "bg-zinc-900 border border-zinc-800"
                    }`}
                  >

                    {message.agent && (

                      <div className="mb-4 inline-flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">

                        <Bot size={14} />

                        {message.agent} agent

                      </div>

                    )}

                    {message.fileName && (

                      <div className="mb-4 inline-flex items-center gap-2 bg-black/20 border border-white/10 px-3 py-2 rounded-xl text-sm">

                        <FileText size={16} />

                        {message.fileName}

                      </div>

                    )}

                    <div className="prose prose-invert max-w-none prose-p:leading-7 prose-pre:bg-black/40">

                      <ReactMarkdown>
                        {message.content}
                      </ReactMarkdown>

                    </div>

                    {message.sources &&
                      message.sources.length > 0 && (

                      <div className="mt-6 space-y-3">

                        <div className="text-sm text-zinc-400 font-medium">
                          Sources
                        </div>

                        {message.sources.map(
                          (source, idx) => (

                            <div
                              key={idx}
                              className="bg-black/30 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300"
                            >
                              {source}
                            </div>

                          )
                        )}

                      </div>

                    )}

                  </div>

                </div>

              ))}

              {loading && (

                <div className="flex justify-start">

                  <div className="bg-zinc-900 border border-zinc-800 rounded-3xl px-6 py-5">

                    <div className="flex gap-2">

                      <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce"></div>

                      <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce delay-150"></div>

                      <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce delay-300"></div>

                    </div>

                  </div>

                </div>

              )}

              <div ref={messagesEndRef} />

            </div>

          )}

        </div>


        {/* INPUT */}

        <div className="border-t border-zinc-900 bg-black p-5">

          <div className="max-w-5xl mx-auto">

            {selectedFile && (

              <div className="mb-3 inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full text-sm">

                <FileText size={16} />

                {selectedFile.name}

              </div>

            )}

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-3 flex items-end gap-3 shadow-2xl">

              <label className="cursor-pointer hover:bg-zinc-800 p-3 rounded-2xl transition">

                <Plus size={22} />

                <input
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    setSelectedFile(
                      e.target.files?.[0] || null
                    )
                  }
                />

              </label>

              <textarea
                rows={1}
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                onKeyDown={(e) => {

                  if (
                    e.key === "Enter" &&
                    !e.shiftKey
                  ) {

                    e.preventDefault();

                    sendMessage();
                  }
                }}
                placeholder="Ask anything about your documents..."
                className="flex-1 bg-transparent outline-none resize-none max-h-40 py-3 text-zinc-100 placeholder:text-zinc-500"
              />

              <button
                onClick={sendMessage}
                disabled={loading}
                className="bg-white text-black hover:bg-zinc-200 transition p-3 rounded-2xl disabled:opacity-50"
              >

                <Send size={20} />

              </button>

            </div>

            <p className="text-center text-xs text-zinc-500 mt-3">

              OpsPilot AI may generate inaccurate
              responses. Verify important outputs.

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
