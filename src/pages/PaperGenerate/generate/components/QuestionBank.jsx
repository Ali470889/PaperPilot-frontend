import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChapterAccordion from "./ChapterAccordion";

const QuestionBank = ({ chapters, activeSection, onAddQuestion }) => {
  return (
    <Card className="h-full w-full rounded-none border-0">
      <CardHeader>
        <CardTitle>Question Bank</CardTitle>
        <p className="text-sm text-muted-foreground">
          {activeSection
            ? `Adding into: ${activeSection.title}`
            : "Select a section on the left to enable Add."}
        </p>
      </CardHeader>

      <CardContent className="overflow-hidden h-full" >
        <ScrollArea className="pr-3 h-full">
          <ChapterAccordion
            chapters={chapters}
            activeSection={activeSection}
            onAddQuestion={onAddQuestion}
          />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default QuestionBank;