export default function Header() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3 pb-4 sm:pb-6 border-b border-slate-200">
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">Q-Stack</h1>
        <p className="mt-1 text-sm sm:text-base text-slate-600">Smart Questions, Better Answers</p>
      </div>

      <div className="px-3 sm:px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm sm:text-base whitespace-nowrap">
        💡 Questions Platform
      </div>
    </div>
  );
}