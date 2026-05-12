import { useState } from "react";

import {
  Send,
  Plus,
  MessageSquare,
  PanelLeft,
  FileText,
} from "lucide-react";

import ReactMarkdown from "react-markdown";

import API from "../services/api";

interface Message {
  role: "user" | "assistant";
  content: string;
  fileName?: string;
}

function Dashboard() {

  const [query, setQuery] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);

  const [loading, setLoading] = useState(false);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);


  const sendMessage = async () => {

    if (!query.trim() && !selectedFile) return;

    let uploadedFileName = "";

    try {

      // UPLOAD FILE FIRST

      if (selectedFile) {

        uploadedFileName = selectedFile.name;

        const formData = new FormData();

        formData.append("file", selectedFile);

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
      }


      // ADD USER MESSAGE

      const userMessage: Message = {
        role: "user",
        content: query,
        fileName: uploadedFileName || undefined,
      };

      setMessages((prev) => [
        ...prev,
        userMessage,
      ]);


      setLoading(true);


      // SEND CHAT QUERY

      const response = await API.post(
        "/chat/",
        {
          query,
        }
      );

      const assistantMessage: Message = {
        role: "assistant",
        content: response.data.response,
      };

      setMessages((prev) => [
        ...prev,
        assistantMessage,
      ]);

    } catch (error) {
      console.log(error);
    }

    setQuery("");
    setSelectedFile(null);
    setLoading(false);
  };


  return (
    <div className="h-screen bg-black text-white flex overflow-hidden">

      {/* SIDEBAR */}

      <div className="w-[260px] bg-zinc-950 border-r border-zinc-900 flex flex-col">

        <div className="p-4 border-b border-zinc-900">

          <button className="w-full flex items-center gap-3 bg-zinc-900 hover:bg-zinc-800 transition rounded-xl p-3">

            <Plus size={18} />

            <span>New Chat</span>

          </button>

        </div>


        <div className="flex-1 overflow-y-auto p-3 space-y-2">

          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-900 cursor-pointer transition">

            <MessageSquare size={18} />

            <span className="text-sm text-zinc-300">
              Crew scheduling analysis
            </span>

          </div>

        </div>


        <div className="border-t border-zinc-900 p-4">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">

              R

            </div>

            <div>

              <p className="font-medium">
                Rishuv
              </p>

              <p className="text-xs text-zinc-400">
                Pro Plan
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* MAIN CHAT AREA */}

      <div className="flex-1 flex flex-col bg-black">

        {/* TOPBAR */}

        <div className="h-16 border-b border-zinc-900 flex items-center px-6">

          <div className="flex items-center gap-3">

            <PanelLeft size={20} />

            <h1 className="text-xl font-semibold">
              OpsPilot AI
            </h1>

          </div>

        </div>


        {/* CHAT AREA */}

        <div className="flex-1 overflow-y-auto">

          {messages.length === 0 ? (

            <div className="h-full flex flex-col items-center justify-center px-6">

              <h1 className="text-5xl font-bold mb-4 text-center">

                Welcome to OpsPilot AI

              </h1>

              <p className="text-zinc-400 text-lg text-center max-w-2xl">

                Upload enterprise documents and
                ask intelligent questions using
                AI-powered RAG workflows.

              </p>

            </div>

          ) : (

            <div className="max-w-4xl mx-auto w-full py-10 px-4 space-y-8">

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

                    {/* FILE CHIP */}

                    {message.fileName && (

                      <div className="mb-4 inline-flex items-center gap-2 bg-black/20 px-3 py-2 rounded-xl text-sm">

                        <FileText size={16} />

                        {message.fileName}

                      </div>

                    )}


                    {/* MESSAGE */}

                    {message.content && (

                      <div className="prose prose-invert max-w-none">

                        <ReactMarkdown>
                          {message.content}
                        </ReactMarkdown>

                      </div>

                    )}

                  </div>

                </div>

              ))}


              {/* LOADING */}

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

            </div>

          )}

        </div>


        {/* INPUT SECTION */}

        <div className="border-t border-zinc-900 bg-black p-6">

          <div className="max-w-4xl mx-auto">

            {/* SELECTED FILE PREVIEW */}

            {selectedFile && (

              <div className="mb-3 inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full text-sm">

                <FileText size={16} />

                {selectedFile.name}

              </div>

            )}


            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-3 flex items-end gap-3">

              {/* UPLOAD */}

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


              {/* TEXTAREA */}

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


              {/* SEND */}

              <button
                onClick={sendMessage}
                disabled={loading}
                className="bg-white text-black hover:bg-zinc-200 transition p-3 rounded-2xl disabled:opacity-50"
              >

                <Send size={20} />

              </button>

            </div>


            <p className="text-center text-xs text-zinc-500 mt-3">

              OpsPilot AI can make mistakes.
              Verify important information.

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
