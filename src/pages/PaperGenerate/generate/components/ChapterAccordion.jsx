import { BookOpen, FileText } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import QuestionItem from "./QuestionItem";

const ChapterAccordion = ({ chapters, activeSection, onAddQuestion }) => {
  return (
    <Accordion type="multiple" className="space-y-2">
      {chapters.map((chapter) => (
        <AccordionItem
          key={chapter.id ?? chapter.name}
          value={`chapter-${chapter.id ?? chapter.name}`}
          className="rounded-md border px-2"
        >
          <AccordionTrigger className="py-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <BookOpen className="h-4 w-4 text-primary" />
              <span>
                Chapter {chapter.number ? `${chapter.number}: ` : ""}
                {chapter.name}
              </span>
            </div>
          </AccordionTrigger>

          <AccordionContent className="space-y-2 pb-2">
            <Accordion type="multiple" className="space-y-2 pl-2">
              {(chapter.topics ?? []).map((topic) => (
                <AccordionItem
                  key={topic.id ?? topic.name}
                  value={`topic-${topic.id ?? topic.name}`}
                  className="rounded-md border px-2"
                >
                  <AccordionTrigger className="py-2">
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4" />
                      <span>{topic.name}</span>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="space-y-2 pb-2">
                    {(topic.questions ?? []).map((question) => (
                      <QuestionItem
                        key={question.id ?? `${topic.name}-${Math.random()}`}
                        chapter={chapter}
                        topic={topic}
                        question={question}
                        canAdd={Boolean(activeSection)}
                        onAdd={() => onAddQuestion(chapter, topic, question)}
                      />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default ChapterAccordion;