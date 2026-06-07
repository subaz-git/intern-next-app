export default function SearchFilter({
  searchQuery,
  setSearchQuery,
  filterCategory,
  setFilterCategory,
  categories,
  totalQuestions,
  filteredCount,
}) {
  return (
    <div className="mb-8 p-6 rounded-lg bg-white border border-slate-200 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            🔍 Search Questions
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keywords..."
            className="w-full px-4 py-2 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            📂 Filter by Category
          </label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200 bg-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 text-sm text-slate-600">
        {totalQuestions === 0 ? (
          <span>No questions available</span>
        ) : (
          <span>
            Showing <span className="font-semibold text-slate-900">{filteredCount}</span> of{" "}
            <span className="font-semibold text-slate-900">{totalQuestions}</span> questions
          </span>
        )}
      </div>
    </div>
  );
}
