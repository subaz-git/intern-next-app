export default function Header() {
  return (
    <div className="flex justify-between items-center mb-12">
      <div>
        <h1 className="text-6xl font-black bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Q-Stack
        </h1>

        <p className="mt-2 text-lg text-slate-500">
          Ask • Enhance • Vote
        </p>
      </div>

      <div className="px-6 py-3 rounded-2xl backdrop-blur-xl border-2 bg-white/40 border-white/60 font-semibold text-slate-700">
        💡 Smart Questions
      </div>
    </div>
  );
}