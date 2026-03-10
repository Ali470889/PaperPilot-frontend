import { useState } from "react";
import { Delete, GripVertical, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Section = ({
  section,
  isActive,
  onActivate,
  onRemoveSection,
  onRemoveQuestion,
  onDropQuestion,
  onReorderQuestions,
}) => {
  const [isDraggingOverSection, setIsDraggingOverSection] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  const handleSectionDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOverSection(true);
  };

  const handleSectionDragLeave = () => {
    setIsDraggingOverSection(false);
  };

  const handleSectionDrop = (e) => {
    e.preventDefault();
    setIsDraggingOverSection(false);

    const fromBankRaw = e.dataTransfer.getData("application/question");
    if (!fromBankRaw) return;

    try {
      const payload = JSON.parse(fromBankRaw);
      onDropQuestion(payload.chapter, payload.topic, payload.question);
      onActivate();
    } catch {
      // ignore invalid payload
    }
  };

  const handleQuestionDragStart = (e, index) => {
    setDraggingIndex(index);
    e.dataTransfer.setData(
      "application/section-question",
      JSON.stringify({ fromIndex: index })
    );
    e.dataTransfer.effectAllowed = "move";
  };

  const handleQuestionDragEnd = () => {
    setDraggingIndex(null);
    setOverIndex(null);
  };

  const handleQuestionDragOver = (e, index) => {
    const sectionPayload = e.dataTransfer.getData("application/section-question");
    if (!sectionPayload) return;
    e.preventDefault();
    setOverIndex(index);
  };

  const handleQuestionDrop = (e, dropIndex) => {
    const sectionPayload = e.dataTransfer.getData("application/section-question");
    if (!sectionPayload) return;

    e.preventDefault();
    e.stopPropagation();

    try {
      const { fromIndex } = JSON.parse(sectionPayload);
      if (Number.isInteger(fromIndex)) {
        onReorderQuestions(fromIndex, dropIndex);
      }
    } catch {
      // ignore invalid payload
    } finally {
      setDraggingIndex(null);
      setOverIndex(null);
    }
  };

  return (
    <Card
      onClick={onActivate}
      onDragOver={handleSectionDragOver}
      onDragLeave={handleSectionDragLeave}
      onDrop={handleSectionDrop}
      className={[
        "cursor-pointer transition-colors",
        isActive ? "ring-1 ring-primary border-primary" : "",
        isDraggingOverSection ? "bg-accent/50 border-primary" : "",
      ].join(" ")}
    >
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="text-base">{section.title}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onRemoveSection();
          }}
          title="Remove section"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-2">
        {section.questions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Drop questions here or use Add from Question Bank.
          </p>
        ) : (
          section.questions.map((q, index) => (
            <div
              key={q.instanceId}
              draggable
              onDragStart={(e) => handleQuestionDragStart(e, index)}
              onDragEnd={handleQuestionDragEnd}
              onDragOver={(e) => handleQuestionDragOver(e, index)}
              onDrop={(e) => handleQuestionDrop(e, index)}
              className={[
                "rounded-md border bg-background p-2 text-sm",
                draggingIndex === index ? "opacity-50" : "",
                overIndex === index ? "border-primary ring-1 ring-primary/40" : "",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <GripVertical className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      Q{index + 1}. {q.text}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {q.chapterName} / {q.topicName}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveQuestion(q.instanceId);
                  }}
                >
                 <Delete className="text-destructive" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default Section;