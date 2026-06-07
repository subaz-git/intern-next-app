"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [statements, setStatements] = useState([]);

  const addStatement = () => {
    if (!input.trim()) return;

    const newStatement = {
      id: Date.now(),
      text: input,
      votes: 0,
    };

    setStatements((prev) => [newStatement, ...prev]);
    setInput("");
  };

  const upvote = (id) => {
    setStatements((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, votes: item.votes + 1 }
          : item
      )
    );
  };

  const downvote = (id) => {
    setStatements((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, votes: item.votes - 1 }
          : item
      )
    );
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Statement Stack
      </h1>

      <div className="flex gap-2 mb-6">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a statement..."
          className="flex-1 border rounded px-3 py-2"
        />

        <button
          onClick={addStatement}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>

        <button className="bg-purple-600 text-white px-4 py-2 rounded">
          Enhance
        </button>
      </div>

      <div className="space-y-4">
        {statements.map((statement) => (
          <div
            key={statement.id}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div>
              <p>{statement.text}</p>
              <p>Score: {statement.votes}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => upvote(statement.id)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                👍
              </button>

              <button
                onClick={() => downvote(statement.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                👎
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}