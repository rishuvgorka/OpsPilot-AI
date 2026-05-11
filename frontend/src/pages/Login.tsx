import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import API from "../services/api";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const response = await API.post(
        "/auth/login/",
        formData
      );

      localStorage.setItem(
        "access",
        response.data.access
      );

      localStorage.setItem(
        "refresh",
        response.data.refresh
      );

      navigate("/dashboard");

    } catch (error) {
      console.log(error);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex relative">

      {/* Top Left Logo */}
      <div className="absolute top-10 left-10">

        <Link
          to="/"
          className="text-3xl font-bold hover:text-zinc-300 transition"
        >
          OpsPilot AI
        </Link>
      </div>

      {/* Left Side */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-16 border-r border-zinc-800">

        <div className="max-w-xl">

          <div className="bg-zinc-900 px-4 py-2 rounded-full text-sm inline-block mb-6">
            AI Operations Platform
          </div>

          <h1 className="text-5xl font-bold leading-tight">
            Welcome back to OpsPilot AI
          </h1>

          <p className="text-zinc-400 text-lg mt-6 leading-relaxed">
            Multi-agent enterprise AI workflows powered
            by LangChain, LangGraph, and RAG pipelines.
          </p>

        </div>

      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center">

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 border border-zinc-800 p-10 rounded-3xl w-[420px] space-y-6"
        >

          <div>

            <h1 className="text-4xl font-bold">
              Login
            </h1>

            <p className="text-zinc-400 mt-2">
              Enter your credentials to continue
            </p>

          </div>

          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700 outline-none focus:border-white"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700 outline-none focus:border-white"
          />

          <button
            type="submit"
            className="w-full bg-white text-black p-4 rounded-xl font-semibold hover:bg-zinc-200 transition"
          >
            Login
          </button>

          <p className="text-center text-sm text-zinc-400">

            Don’t have an account?{" "}

            <Link
              to="/register"
              className="text-white font-semibold"
            >
              Register
            </Link>

          </p>

        </form>

      </div>

    </div>
  );
}

export default Login;
