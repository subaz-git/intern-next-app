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
    <div className="p-4 sm:p-6 rounded-lg mb-6 sm:mb-8 bg-white border border-slate-200 shadow-sm">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 px-3 sm:px-4 py-2 rounded-lg border border-slate-300 text-sm sm:text-base text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 sm:px-4 py-2 rounded-lg border border-slate-300 text-sm sm:text-base text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200 bg-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={addQuestion}
            className="px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm sm:text-base bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 hover:cursor-pointer active:scale-95 shadow-sm"
          >
            ➕ Add
          </button>

          <button
            onClick={enhanceQuestion}
            disabled={enhancing}
            className="px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm sm:text-base bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:cursor-pointer active:scale-95 shadow-sm"
          >
            {enhancing ? "✨ Enhancing..." : "✨ Enhance"}
          </button>
        </div>
      </div>
    </div>
  );
}