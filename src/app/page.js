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

  useEffect(() => {
    loadQuestions();
  }, []);

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
    await loadQuestions();
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
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

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