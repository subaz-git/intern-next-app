"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [input, setInput] = useState("");
  const [questions, setQuestions] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [enhancing, setEnhancing] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  async function loadQuestions() {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .order("votes", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setQuestions(data || []);
  }

  async function enhanceQuestion() {
    if (!input.trim()) return;

    try {
      setEnhancing(true);

      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: input,
        }),
      });

      const data = await res.json();

      if (data.enhanced) {
        setInput(data.enhanced.trim());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEnhancing(false);
    }
  }

  async function addQuestion() {
    const words = input.trim().split(/\s+/);

    if (words.length < 3) {
      alert("Question must contain at least 3 words.");
      return;
    }

    const { error } = await supabase
      .from("questions")
      .insert({
        text: input.trim(),
      });

    if (error) {
      console.error(error);
      return;
    }

    setInput("");
    loadQuestions();
  }

  async function vote(question, change) {
    const newVotes = question.votes + change;

    const { error } = await supabase
      .from("questions")
      .update({
        votes: newVotes,
      })
      .eq("id", question.id);

    if (error) {
      console.error(error);
      return;
    }

    loadQuestions();
  }

  return (
    <main
      className={`min-h-screen ${
        darkMode
          ? "bg-slate-950 text-white"
          : "bg-slate-100 text-slate-900"
      }`}
    >
      <div className="max-w-4xl mx-auto p-6">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-extrabold">
              Question Stack
            </h1>

            <p
              className={
                darkMode
                  ? "text-slate-400"
                  : "text-slate-600"
              }
            >
              Ask and vote on questions.
            </p>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <div
          className={`p-6 rounded-3xl mb-8 ${
            darkMode
              ? "bg-slate-900"
              : "bg-white"
          }`}
        >
          <div className="flex gap-3 flex-col md:flex-row">
            <input
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              placeholder="Enter a question..."
              className={`flex-1 px-4 py-3 rounded-xl border ${
                darkMode
                  ? "bg-slate-800 border-slate-700"
                  : "bg-white border-slate-300"
              }`}
            />

            <button
              onClick={addQuestion}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white"
            >
              Add
            </button>

            <button
              onClick={enhanceQuestion}
              disabled={enhancing}
              className="px-6 py-3 rounded-xl bg-purple-600 text-white"
            >
              {enhancing
                ? "Enhancing..."
                : "✨ Enhance"}
            </button>
          </div>
        </div>

        {questions.length === 0 && (
          <div className="text-center p-10">
            No questions yet.
          </div>
        )}

        <div className="space-y-4">
          {questions.map((question) => (
            <div
              key={question.id}
              className={`p-5 rounded-3xl ${
                darkMode
                  ? "bg-slate-900"
                  : "bg-white"
              }`}
            >
              <p className="text-lg mb-4">
                {question.text}
              </p>

              <div className="flex justify-between items-center">
                <span className="font-bold">
                  Score: {question.votes}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      vote(question, 1)
                    }
                    className="px-4 py-2 rounded-lg bg-green-600 text-white"
                  >
                    👍
                  </button>

                  <button
                    onClick={() =>
                      vote(question, -1)
                    }
                    className="px-4 py-2 rounded-lg bg-red-600 text-white"
                  >
                    👎
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