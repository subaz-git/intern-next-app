export default function QuestionForm({
  input,
  setInput,
  addQuestion,
  enhanceQuestion,
  enhancing,
  darkMode,
}) {
  return (
    <div
      className={`p-6 rounded-3xl mb-8 ${
        darkMode ? "bg-slate-900" : "bg-white"
      }`}
    >
      <div className="flex gap-3 flex-col md:flex-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
          {enhancing ? "Enhancing..." : "✨ Enhance"}
        </button>
      </div>
    </div>
  );
}