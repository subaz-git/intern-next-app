export default function QuestionCard({
  question,
  vote,
  darkMode,
}) {
  return (
    <div
      className={`p-5 rounded-3xl ${
        darkMode ? "bg-slate-900" : "bg-white"
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
  );
}