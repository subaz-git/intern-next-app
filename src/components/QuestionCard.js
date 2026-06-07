export default function QuestionCard({
  question,
  vote,
}) {
  return (
    <div className="p-6 rounded-3xl backdrop-blur-2xl border-2 bg-gradient-to-br from-blue-400/10 to-purple-400/10 border-white/60 transition-all duration-300">
      <p className="text-lg mb-5 font-medium leading-relaxed text-slate-900">
        {question.text}
      </p>

      <div className="flex justify-between items-center pt-4 border-t border-white/20">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl bg-white/20 border border-white/30">
          <span className="text-lg">⭐</span>
          <span className="font-bold text-lg text-slate-900">{question.votes}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => vote(question, 1)}
            className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 backdrop-blur-xl border-2 active:scale-95 hover:cursor-pointer ${
              question.userVote === 1
                ? "bg-gradient-to-r from-green-500 to-emerald-500 border-green-400/50 text-white shadow-lg shadow-green-500/50"
                : "bg-white/30 border-white/40 text-slate-900 hover:bg-white/50 hover:border-green-400/50 active:shadow-md hover:cursor-pointer"
            }`}
          >
            👍
          </button>

          <button
            onClick={() => vote(question, -1)}
            className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 backdrop-blur-xl border-2 active:scale-95 hover:cursor-pointer ${
              question.userVote === -1
                ? "bg-gradient-to-r from-red-500 to-pink-500 border-red-400/50 text-white shadow-lg shadow-red-500/50"
                : "bg-white/30 border-white/40 text-slate-900 hover:bg-white/50 hover:border-red-400/50 active:shadow-md hover:cursor-pointer"
            }`}
          >
            👎
          </button>
        </div>
      </div>
    </div>
  );
}