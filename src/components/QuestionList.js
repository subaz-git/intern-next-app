import QuestionCard from "./QuestionCard";

export default function QuestionList({
  questions,
  vote,
  darkMode,
}) {
  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          vote={vote}
          darkMode={darkMode}
        />
      ))}
    </div>
  );
}