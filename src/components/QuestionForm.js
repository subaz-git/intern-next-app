export default function QuestionForm({
  input,
  setInput,
  category,
  setCategory,
  categories,
  addQuestion,
  enhanceQuestion,
  enhancing,
}) {
  return (
    <div className="p-6 rounded-lg mb-8 bg-white border border-slate-200 shadow-sm">
      <div className="flex gap-3 flex-col">
        <div className="flex gap-3 flex-col md:flex-row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200 bg-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={addQuestion}
            className="px-6 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 hover:cursor-pointer active:scale-95 shadow-sm"
          >
            ➕ Add
          </button>

          <button
            onClick={enhanceQuestion}
            disabled={enhancing}
            className="px-6 py-2 rounded-lg font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:cursor-pointer active:scale-95 shadow-sm"
          >
            {enhancing ? "✨ Enhancing..." : "✨ Enhance"}
          </button>
        </div>
      </div>
    </div>
  );
}