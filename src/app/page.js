  "use client";

  import { useEffect, useState } from "react";
  import { supabase } from "@/lib/supabase";

  function getBrowserId() {
    let id = localStorage.getItem("browserId");

    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("browserId", id);
    }

    return id;
  }

  export default function Home() {
    const [input, setInput] = useState("");
    const [questions, setQuestions] = useState([]);
    const [darkMode, setDarkMode] = useState(true);
    const [enhancing, setEnhancing] = useState(false);
    const [askCooldown, setAskCooldown] = useState(false);

    useEffect(() => {
      loadQuestions();
    }, []);

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

async function loadQuestions() {
  const browserId = getBrowserId();

  const { data: questionsData, error } = await supabase
    .from("questions")
    .select("*")
    .order("votes", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const { data: votesData, error: votesError } = await supabase
    .from("votes")
    .select("*")
    .eq("browser_id", browserId);

  if (votesError) {
    console.error(votesError);
    return;
  }

  const voteMap = {};

  votesData.forEach((vote) => {
    voteMap[vote.question_id] = vote.vote_type;
  });

  const questionsWithVotes = questionsData.map((question) => ({
    ...question,
    userVote: voteMap[question.id] || 0,
  }));

  setQuestions(questionsWithVotes);
}

    async function addQuestion() {
      const words = input.trim().split(/\s+/);
      if (askCooldown) {
  alert("Please wait 3 seconds before asking again.");
  return;
}

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
      setAskCooldown(true);

setTimeout(() => {
  setAskCooldown(false);
}, 3000);
      loadQuestions();
      
    }

  async function vote(question, voteType) {
    try {
      const browserId = getBrowserId();

      const { data: existingVote, error: checkError } = await supabase
        .from("votes")
        .select("*")
        .eq("question_id", question.id)
        .eq("browser_id", browserId)
        .maybeSingle();

      if (checkError) {
        console.error(checkError);
        return;
      }

      let scoreChange = 0;

      // No previous vote
      if (!existingVote) {
        await supabase.from("votes").insert({
          question_id: question.id,
          browser_id: browserId,
          vote_type: voteType,
        });

        scoreChange = voteType;
      }

      // Same vote clicked again -> remove vote
      else if (existingVote.vote_type === voteType) {
        await supabase
          .from("votes")
          .delete()
          .eq("id", existingVote.id);

        scoreChange = -voteType;
      }

      // Switch vote
      else {
        await supabase
          .from("votes")
          .update({
            vote_type: voteType,
          })
          .eq("id", existingVote.id);

        scoreChange = voteType * 2;
      }

      const { data: allVotes, error: votesError } = await supabase
  .from("votes")
  .select("vote_type")
  .eq("question_id", question.id);

if (votesError) {
  console.error(votesError);
  return;
}

const totalVotes = allVotes.reduce(
  (sum, vote) => sum + vote.vote_type,
  0
);

const { error: updateError } = await supabase
  .from("questions")
  .update({
    votes: totalVotes,
  })
  .eq("id", question.id);

      if (updateError) {
        console.error(updateError);
        return;
      }

      await loadQuestions();
    } catch (err) {
      console.error(err);
    }
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
  disabled={askCooldown}
  className={`px-6 py-3 rounded-xl text-white ${
    askCooldown
      ? "bg-gray-500 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  {askCooldown ? "Wait 3s..." : "Add"}
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
    onClick={() => vote(question, 1)}
    className={`px-4 py-2 rounded-lg text-white transition ${
      question.userVote === 1
        ? "bg-gray-500"
        : "bg-green-600 hover:bg-green-700"
    }`}
  >
    👍
  </button>

  <button
    onClick={() => vote(question, -1)}
    className={`px-4 py-2 rounded-lg text-white transition ${
      question.userVote === -1
        ? "bg-gray-500"
        : "bg-red-600 hover:bg-red-700"
    }`}
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