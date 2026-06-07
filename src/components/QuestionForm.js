export default function QuestionForm({
  input,
  setInput,
  addQuestion,
  enhanceQuestion,
  enhancing,
}) {
  return (
    <div className="p-6 rounded-3xl mb-8 backdrop-blur-2xl border-2 bg-white/40 border-white/60 hover:border-white/80 transition-all duration-300">
      <div className="flex gap-3 flex-col md:flex-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something incredible..."
          className="flex-1 px-4 py-3 rounded-2xl backdrop-blur-xl border-2 bg-white/50 border-white/40 text-slate-900 placeholder-slate-600 focus:border-purple-400/50 focus:outline-none focus:bg-white/70 transition-all duration-300"
        />

        <button
          onClick={addQuestion}
          className="px-8 py-3 rounded-2xl font-semibold backdrop-blur-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-2 border-blue-400/50 hover:border-blue-300/50 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/50 hover:cursor-pointer active:scale-95 active:shadow-md"
        >
          ➕ Add
        </button>

        <button
          onClick={enhanceQuestion}
          disabled={enhancing}
          className="px-8 py-3 rounded-2xl font-semibold backdrop-blur-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white border-2 border-purple-400/50 hover:border-purple-300/50 transition-all duration-200 disabled:opacity-60 hover:shadow-lg hover:shadow-purple-500/50 hover:cursor-pointer active:scale-95 active:shadow-md"
        >
          {enhancing ? "✨ Enhancing..." : "✨ Enhance"}
        </button>
      </div>
    </div>
  );
}