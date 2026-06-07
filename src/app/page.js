"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import Header from "@/components/Header";
import QuestionForm from "@/components/QuestionForm";
import SearchFilter from "@/components/SearchFilter";
import QuestionList from "@/components/QuestionList";

function getBrowserId() {
  let id = localStorage.getItem("browserId");

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("browserId", id);
  }

  return id;
}

const CATEGORIES = [
  "All",
  "General",
  "Technology",
  "Business",
  "Science",
  "Education",
  "Health",
  "Other",
];

const SORT_OPTIONS = [
  { value: "score-high", label: "Score: High to Low" },
  { value: "score-low", label: "Score: Low to High" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "alphabetical-az", label: "Alphabetical (A - Z)" },
  { value: "alphabetical-za", label: "Alphabetical (Z - A)" },
];

export default function Home() {
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("General");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("score-high");
  const [questions, setQuestions] = useState([]);
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
      .select("*");

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

  const getSortedQuestions = (questionsToSort) => {
    const sorted = [...questionsToSort];

    switch (sortBy) {
      case "score-high":
        return sorted.sort((a, b) => b.votes - a.votes);
      case "score-low":
        return sorted.sort((a, b) => a.votes - b.votes);
      case "newest":
        return sorted.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      case "oldest":
        return sorted.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
      case "alphabetical-az":
        return sorted.sort((a, b) => a.text.localeCompare(b.text));
      case "alphabetical-za":
        return sorted.sort((a, b) => b.text.localeCompare(a.text));
      default:
        return sorted;
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.text
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || q.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const displayedQuestions = getSortedQuestions(filteredQuestions);

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
        category: category,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error(error);
      setError("Failed to add question. Please try again.");
      return;
    }

    setInput("");
    setCategory("General");
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
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <Header />

        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm sm:text-base transition-all duration-300">
            ⚠️ {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm sm:text-base transition-all duration-300">
            ✅ {successMessage}
          </div>
        )}

        <QuestionForm
          input={input}
          setInput={setInput}
          category={category}
          setCategory={setCategory}
          categories={CATEGORIES.slice(1)}
          addQuestion={addQuestion}
          enhanceQuestion={enhanceQuestion}
          enhancing={enhancing}
        />

        <SearchFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={CATEGORIES}
          sortOptions={SORT_OPTIONS}
          totalQuestions={questions.length}
          filteredCount={displayedQuestions.length}
        />

        {displayedQuestions.length === 0 ? (
          <div className="text-center p-8 sm:p-12 rounded-lg bg-white border border-slate-200 text-slate-500">
            <p className="text-base sm:text-lg font-medium">
              {questions.length === 0 ? "No questions yet" : "No questions match your search"}
            </p>
            <p className="mt-1 text-sm sm:text-base">
              {questions.length === 0 ? "Ask the first question to get started" : "Try adjusting your filters"}
            </p>
          </div>
        ) : (
          <QuestionList
            questions={displayedQuestions}
            vote={vote}
          />
        )}
      </div>
    </main>
  );
}