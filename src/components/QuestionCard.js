export default function QuestionCard({
  question,
  vote,
}) {
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours() % 12 || 12).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";
    return `${day}/${month}/${year} - ${hours}:${minutes} ${ampm}`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      "General": "bg-slate-100 text-slate-700",
      "Technology": "bg-blue-100 text-blue-700",
      "Business": "bg-green-100 text-green-700",
      "Science": "bg-purple-100 text-purple-700",
      "Education": "bg-orange-100 text-orange-700",
      "Health": "bg-red-100 text-red-700",
      "Other": "bg-slate-100 text-slate-700",
    };
    return colors[category] || colors["General"];
  };

  return (
    <div className="p-4 sm:p-6 rounded-lg bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
        <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(question.category)}`}>
          {question.category || "General"}
        </div>
        <div className="text-xs text-slate-500 whitespace-nowrap">
          {formatDate(question.created_at)}
        </div>
      </div>

      <p className="text-sm sm:text-base mb-4 font-medium leading-relaxed text-slate-900">
        {question.text}
      </p>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 sm:pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2 px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 rounded-md">
          <span>⭐</span>
          <span>{question.votes}</span>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => vote(question, 1)}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 active:scale-95 hover:cursor-pointer ${
              question.userVote === 1
                ? "bg-green-600 text-white shadow-sm hover:bg-green-700"
                : "bg-slate-100 text-slate-700 hover:bg-green-50 hover:text-green-700 border border-slate-200"
            }`}
          >
            👍 Vote
          </button>

          <button
            onClick={() => vote(question, -1)}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 active:scale-95 hover:cursor-pointer ${
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