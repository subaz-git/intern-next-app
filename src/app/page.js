"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [statements, setStatements] = useState([]);
  const [darkMode, setDarkMode] = useState(true);

  const addStatement = () => {
    const words = input.trim().split(/\s+/);

    if (words.length < 3) {
      alert("Statement must contain at least 3 words.");
      return;
    }

    const newStatement = {
      id: Date.now(),
      text: input.trim(),
      votes: 0,
      userVote: null,
    };

    setStatements((prev) => [newStatement, ...prev]);
    setInput("");
  };

  const upvote = (id) => {
    setStatements((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (item.userVote === "up") return item;

        if (item.userVote === "down") {
          return {
            ...item,
            votes: item.votes + 2,
            userVote: "up",
          };
        }

        return {
          ...item,
          votes: item.votes + 1,
          userVote: "up",
        };
      })
    );
  };

  const downvote = (id) => {
    setStatements((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (item.userVote === "down") return item;

        if (item.userVote === "up") {
          return {
            ...item,
            votes: item.votes - 2,
            userVote: "down",
          };
        }

        return {
          ...item,
          votes: item.votes - 1,
          userVote: "down",
        };
      })
    );
  };

  return (
    <main
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-slate-950 text-white"
          : "bg-slate-100 text-slate-900"
      }`}
    >
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Statement Stack
            </h1>

            <p
              className={`mt-2 ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Add statements and vote on them.
            </p>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-5 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
              darkMode
                ? "bg-yellow-500 text-black hover:bg-yellow-400"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* Input Card */}
        <div
          className={`rounded-3xl p-6 shadow-xl border mb-8 ${
            darkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-slate-200"
          }`}
        >
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter a statement (minimum 3 words)"
              className={`flex-1 px-4 py-3 rounded-xl border outline-none transition ${
                darkMode
                  ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  : "bg-white border-slate-300 text-black placeholder:text-slate-500"
              }`}
            />

            <button
              onClick={addStatement}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition"
            >
              Add
            </button>

            <button className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md transition">
              ✨ Enhance
            </button>
          </div>
        </div>

        {/* Empty State */}
        {statements.length === 0 && (
          <div
            className={`text-center p-10 rounded-3xl border ${
              darkMode
                ? "bg-slate-900 border-slate-800 text-slate-400"
                : "bg-white border-slate-200 text-slate-500"
            }`}
          >
            <div className="text-5xl mb-3">📝</div>
            <p>No statements yet.</p>
            <p className="text-sm mt-2">
              Add your first statement above.
            </p>
          </div>
        )}

        {/* Statements */}
        <div className="space-y-5">
          {statements.map((statement) => (
            <div
              key={statement.id}
              className={`rounded-3xl p-5 border shadow-lg transition-all duration-200 hover:scale-[1.01] ${
                darkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-slate-200"
              }`}
            >
              <p className="text-lg leading-relaxed mb-4">
                {statement.text}
              </p>

              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <span
                  className={`font-bold px-4 py-2 rounded-full ${
                    statement.votes > 0
                      ? "bg-green-500/20 text-green-500"
                      : statement.votes < 0
                      ? "bg-red-500/20 text-red-500"
                      : darkMode
                      ? "bg-slate-800 text-slate-300"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  Score: {statement.votes}
                </span>

                <div className="flex gap-3">
                  <button
                    onClick={() => upvote(statement.id)}
                    disabled={statement.userVote === "up"}
                    className={`px-5 py-2 rounded-xl font-semibold transition ${
                      statement.userVote === "up"
                        ? "bg-green-400 text-white cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    👍 Upvote
                  </button>

                  <button
                    onClick={() => downvote(statement.id)}
                    disabled={statement.userVote === "down"}
                    className={`px-5 py-2 rounded-xl font-semibold transition ${
                      statement.userVote === "down"
                        ? "bg-red-400 text-white cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                  >
                    👎 Downvote
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}