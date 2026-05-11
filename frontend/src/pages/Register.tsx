import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import API from "../services/api";

function Register() {

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

      await API.post(
        "/auth/register/",
        formData
      );

      navigate("/login");

    } catch (error) {
      console.log(error);
      alert("Registration failed");
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
            Enterprise GenAI Platform
          </div>

          <h1 className="text-5xl font-bold leading-tight">
            Create your OpsPilot AI account
          </h1>

          <p className="text-zinc-400 text-lg mt-6 leading-relaxed">
            Build intelligent workflows using
            LangChain, LangGraph, RAG pipelines,
            and multi-agent orchestration.
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
              Register
            </h1>

            <p className="text-zinc-400 mt-2">
              Create your account to get started
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
            Create Account
          </button>

          <p className="text-center text-sm text-zinc-400">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-white font-semibold"
            >
              Login
            </Link>

          </p>

        </form>

      </div>

    </div>
  );
}

export default Register;
