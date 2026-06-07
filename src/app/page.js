"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import Header from "@/components/Header";
import QuestionForm from "@/components/QuestionForm";
import QuestionList from "@/components/QuestionList";

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
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadQuestions();
  }, []);

  async function loadQuestions() {
    const browserId = getBrowserId();
    setError("");

    const { data: questionsData, error } = await supabase
      .from("questions")
      .select("*")
      .order("votes", { ascending: false });

    if (error) {
      console.error(error);
      setError("Failed to load questions. Please refresh.");
      return;
    }

    const { data: votesData, error: votesError } = await supabase
      .from("votes")
      .select("*")
      .eq("browser_id", browserId);

    if (votesError) {
      console.error(votesError);
      setError("Failed to load your votes. Please refresh.");
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

  async function enhanceQuestion() {
    if (!input.trim()) return;

    try {
      setEnhancing(true);
      setError("");

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

      if (!res.ok) {
        setError(data.error || "Failed to enhance question");
        return;
      }

      if (data.enhanced) {
        setInput(data.enhanced.trim());
        setSuccessMessage("Question enhanced!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err) {
      console.error(err);
      setError("Error enhancing question. Please try again.");
    } finally {
      setEnhancing(false);
    }
  }

  async function addQuestion() {
    const words = input.trim().split(/\s+/);

    if (words.length < 3) {
      setError("Question must contain at least 3 words.");
      return;
    }

    const { error } = await supabase
      .from("questions")
      .insert({
        text: input.trim(),
      });

    if (error) {
      console.error(error);
      setError("Failed to add question. Please try again.");
      return;
    }

    setInput("");
    setError("");
    setSuccessMessage("Question added!");
    setTimeout(() => setSuccessMessage(""), 3000);
    await loadQuestions();
  }

  async function vote(question, voteType) {
    try {
      setError("");
      const browserId = getBrowserId();

      const { data: existingVote, error: checkError } = await supabase
        .from("votes")
        .select("*")
        .eq("question_id", question.id)
        .eq("browser_id", browserId)
        .maybeSingle();

      if (checkError) {
        console.error(checkError);
        setError("Failed to check vote. Please try again.");
        return;
      }

      if (!existingVote) {
        await supabase.from("votes").insert({
          question_id: question.id,
          browser_id: browserId,
          vote_type: voteType,
        });
      } else if (existingVote.vote_type === voteType) {
        await supabase
          .from("votes")
          .delete()
          .eq("id", existingVote.id);
      } else {
        await supabase
          .from("votes")
          .update({
            vote_type: voteType,
          })
          .eq("id", existingVote.id);
      }

      const { data: allVotes, error: votesError } = await supabase
        .from("votes")
        .select("vote_type")
        .eq("question_id", question.id);

      if (votesError) {
        console.error(votesError);
        setError("Failed to update votes. Please refresh.");
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
        setError("Failed to update question score.");
        return;
      }

      await loadQuestions();
    } catch (err) {
      console.error(err);
      setError("An error occurred while voting.");
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
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-500/20 border border-red-500 text-red-400">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 rounded-xl bg-green-500/20 border border-green-500 text-green-400">
            {successMessage}
          </div>
        )}

        <QuestionForm
          input={input}
          setInput={setInput}
          addQuestion={addQuestion}
          enhanceQuestion={enhanceQuestion}
          enhancing={enhancing}
          darkMode={darkMode}
        />

        {questions.length === 0 ? (
          <div className="text-center p-10">
            No questions yet.
          </div>
        ) : (
          <QuestionList
            questions={questions}
            vote={vote}
            darkMode={darkMode}
          />
        )}
      </div>
    </main>
  );
}