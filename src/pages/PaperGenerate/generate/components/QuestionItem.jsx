import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const QuestionItem = ({ chapter, topic, question, canAdd, onAdd }) => {
  const questionText =
    question?.text?.question ?? question?.text ?? question?.question ?? "Untitled question";

  const handleDragStart = (e) => {
    const payload = {
      chapter: { id: chapter?.id, name: chapter?.name },
      topic: { id: topic?.id, name: topic?.name },
      question,
    };

    e.dataTransfer.setData("application/question", JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex items-start justify-between gap-2 rounded-md border p-2"
    >
      <div className="flex items-start gap-2 text-sm">
        <HelpCircle className="mt-0.5 h-4 w-4 text-muted-foreground" />
        <span>{questionText}</span>
      </div>

      <Button size="sm" onClick={onAdd} disabled={!canAdd}>
        Add
      </Button>
    </div>
  );
};

export default QuestionItem;