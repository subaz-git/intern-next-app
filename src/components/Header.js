export default function Header() {
  return (
    <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-200">
      <div>
        <h1 className="text-5xl font-bold text-slate-900">Q-Stack</h1>
        <p className="mt-1 text-slate-600">Smart Questions, Better Answers</p>
      </div>

      <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
        💡 Questions Platform
      </div>
    </div>
  );
}