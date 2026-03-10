import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StateDisplay } from "@/components/shared/StateDisplay";
import Section from "./Section";

const PaperBuilder = ({
  sections,
  activeSectionId,
  onSetActiveSection,
  onAddSection,
  onRemoveSection,
  onRemoveQuestion,
  onQuestionDrop,
}) => {
  return (
    <Card className="h-full w-full  overflow-hidden rounded-none border-0 ">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Paper Builder</CardTitle>
        <Button onClick={onAddSection} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Section
        </Button>
      </CardHeader>

      <CardContent
        className="h-full overflow-hidden"
      >
        {sections.length === 0 ? (
          <StateDisplay
            state="not-found"
            title="No Sections Yet"
            message="Create your first section to start building the paper."
          />
        ) : (
          <ScrollArea className="pr-3 h-full">
            <div className="space-y-3">
              {sections.map((section) => (
                <Section
                  key={section.id}
                  section={section}
                  isActive={section.id === activeSectionId}
                  onActivate={() => onSetActiveSection(section.id)}
                  onRemoveSection={() => onRemoveSection(section.id)}
                  onRemoveQuestion={(instanceId) =>
                    onRemoveQuestion(section.id, instanceId)
                  }
                  onDropQuestion={(chapter, topic, question) =>
                    onQuestionDrop(section.id, chapter, topic, question)
                  }
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default PaperBuilder;