export default function QuestionCard({
  question,
  vote,
}) {
  return (
    <div className="p-6 rounded-lg bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
      <p className="text-base mb-4 font-medium leading-relaxed text-slate-900">
        {question.text}
      </p>

      <div className="flex justify-between items-center pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2 px-3 py-1 text-sm font-semibold text-slate-700 bg-slate-50 rounded-md">
          <span>⭐</span>
          <span>{question.votes}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => vote(question, 1)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95 hover:cursor-pointer ${
              question.userVote === 1
                ? "bg-green-600 text-white shadow-sm hover:bg-green-700"
                : "bg-slate-100 text-slate-700 hover:bg-green-50 hover:text-green-700 border border-slate-200"
            }`}
          >
            👍 Vote
          </button>

          <button
            onClick={() => vote(question, -1)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95 hover:cursor-pointer ${
              question.userVote === -1
                ? "bg-red-600 text-white shadow-sm hover:bg-red-700"
                : "bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-700 border border-slate-200"
            }`}
          >
            👎 Vote
          </button>
        </div>
      </div>
    </div>
  );
}