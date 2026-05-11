import { Link } from "react-router-dom";

import {
  Bot,
  Database,
  Workflow,
  Shield,
} from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-6 border-b border-zinc-800">

        <h1 className="text-2xl font-bold">
          OpsPilot AI
        </h1>

        <div className="flex gap-4">

          <Link
            to="/login"
            className="px-5 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-900"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-5 py-2 rounded-lg bg-white text-black font-semibold"
          >
            Get Started
          </Link>

        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-32">

        <div className="bg-zinc-900 px-4 py-2 rounded-full text-sm mb-6 border border-zinc-800">
          Production-Grade Multi-Agent AI Platform
        </div>

        <h1 className="text-6xl font-bold max-w-5xl leading-tight">

          Enterprise AI Copilot
          for Intelligent Operations

        </h1>

        <p className="text-zinc-400 text-xl mt-8 max-w-3xl leading-relaxed">

          OpsPilot AI combines LangChain, LangGraph,
          Retrieval-Augmented Generation (RAG),
          and multi-agent workflows into a
          production-ready AI operations platform.

        </p>

        <div className="flex gap-6 mt-10">

          <Link
            to="/register"
            className="bg-white text-black px-8 py-4 rounded-xl font-semibold text-lg"
          >
            Start Building
          </Link>

          <Link
            to="/login"
            className="border border-zinc-700 px-8 py-4 rounded-xl text-lg hover:bg-zinc-900"
          >
            Live Demo
          </Link>

        </div>

      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-10 pb-24">

        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">

          <Bot size={40} />

          <h2 className="text-2xl font-semibold mt-6">
            Multi-Agent AI
          </h2>

          <p className="text-zinc-400 mt-4">
            Intelligent workflows powered by LangGraph
            agent orchestration.
          </p>

        </div>

        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">

          <Database size={40} />

          <h2 className="text-2xl font-semibold mt-6">
            RAG Pipeline
          </h2>

          <p className="text-zinc-400 mt-4">
            Upload documents and perform semantic
            retrieval with vector databases.
          </p>

        </div>

        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">

          <Workflow size={40} />

          <h2 className="text-2xl font-semibold mt-6">
            Workflow Automation
          </h2>

          <p className="text-zinc-400 mt-4">
            Automate enterprise operations using
            AI-driven workflows and reasoning.
          </p>

        </div>

        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">

          <Shield size={40} />

          <h2 className="text-2xl font-semibold mt-6">
            Secure Infrastructure
          </h2>

          <p className="text-zinc-400 mt-4">
            JWT authentication, Dockerized deployment,
            and scalable backend architecture.
          </p>

        </div>

      </section>

    </div>
  );
}

export default Home;
