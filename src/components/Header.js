export default function Header({ darkMode, setDarkMode }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-5xl font-extrabold">
          Question Stack
        </h1>

        <p
          className={
            darkMode
              ? "text-slate-400"
              : "text-slate-600"
          }
        >
          Ask and vote on questions.
        </p>
      </div>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="px-4 py-2 rounded-xl bg-blue-600 text-white"
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>
    </div>
  );
}