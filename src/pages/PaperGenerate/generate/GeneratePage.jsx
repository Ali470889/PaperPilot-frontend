import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import {
    ArrowDown,
    ArrowUp,
    BookOpen,
    FileText,
    HelpCircle,
    Plus,
    Trash2,
    Trash2Icon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { StateDisplay } from "@/components/shared/StateDisplay";
import { useGetBookById } from "@/hooks/useFetchBook";
import PaperBuilder from "./components/PaperBuilder";
import QuestionBank from "./components/QuestionBank";

const demoChapters = [
    {
        id: "ch-1",
        number: 1,
        name: "Biology",
        topics: [
            {
                id: "tp-1",
                name: "Cell Structure",
                questions: [
                    { id: "q-1", text: { question: "What is the function of mitochondria?" } },
                    { id: "q-2", text: { question: "Describe the cell membrane." } },
                ],
            },
            {
                id: "tp-2",
                name: "Genetics",
                questions: [
                    { id: "q-3", text: { question: "Define DNA." } },
                    { id: "q-4", text: { question: "What is a Punnett square?" } },
                ],
            },
        ],
    },
];

const sectionTitle = (index) => `Section ${String.fromCharCode(65 + index)}`;

const toQuestionPayload = (chapter, topic, rawQuestion) => ({
    sourceQuestionId: rawQuestion?.id ?? `q-${Date.now()}`,
    text:
        rawQuestion?.text?.question ??
        rawQuestion?.text ??
        rawQuestion?.question ??
        "Untitled question",
    chapterId: chapter?.id ?? chapter?.name,
    chapterName: chapter?.name ?? "Unknown chapter",
    topicId: topic?.id ?? topic?.name,
    topicName: topic?.name ?? "Unknown topic",
});

const createQuestionInstance = (question) => ({
    ...question,
    instanceId: `qi-${question.sourceQuestionId}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`,
});

const GeneratePage = () => {
    const { bookId } = useParams();
    const { data, isLoading, isError, refetch } = useGetBookById(bookId);

    const chapters = useMemo(() => {
        return data?.data?.chapters ?? [];
    }, [data]);

    const [sections, setSections] = useState([]);
    const [activeSectionId, setActiveSectionId] = useState(null);

    const activeSection = useMemo(
        () => sections.find((s) => s.id === activeSectionId) ?? null,
        [sections, activeSectionId]
    );

    const addSection = () => {
        setSections((prev) => {
            const next = [
                ...prev,
                {
                    id: `sec-${Date.now()}-${prev.length}`,
                    title: sectionTitle(prev.length),
                    questions: [],
                },
            ];
            setActiveSectionId(next[next.length - 1].id);
            return next;
        });
    };

    const removeSection = (sectionId) => {
        setSections((prev) => prev.filter((s) => s.id !== sectionId));
        setActiveSectionId((prev) => (prev === sectionId ? null : prev));
    };

    const addQuestionToSection = (sectionId, chapter, topic, rawQuestion) => {
        const payload = toQuestionPayload(chapter, topic, rawQuestion);
        const instance = createQuestionInstance(payload);

        setSections((prev) =>
            prev.map((section) =>
                section.id === sectionId
                    ? { ...section, questions: [...section.questions, instance] }
                    : section
            )
        );
    };

    const addQuestionToActiveSection = (chapter, topic, rawQuestion) => {
        if (!activeSectionId) return;
        addQuestionToSection(activeSectionId, chapter, topic, rawQuestion);
    };

    const removeQuestion = (sectionId, instanceId) => {
        setSections((prev) =>
            prev.map((section) =>
                section.id === sectionId
                    ? {
                        ...section,
                        questions: section.questions.filter((q) => q.instanceId !== instanceId),
                    }
                    : section
            )
        );
    };

    if (isError) {
        return (
            <StateDisplay
                state="error"
                title="Connection Failed"
                message="Unable to fetch question bank data."
                onRetry={refetch}
            />
        );
    }

    if (isLoading) {
        return (
            <StateDisplay
                state="loading"
                title="Loading..."
                message="Fetching chapters and questions."
            />
        );
    }

    return (
        <ResizablePanelGroup
            orientation="horizontal"
            className="rounded-lg h-full w-full gap-4 border"
        >
            <ResizablePanel defaultSize="70%">
                <PaperBuilder
                    sections={sections}
                    activeSectionId={activeSectionId}
                    onSetActiveSection={setActiveSectionId}
                    onAddSection={addSection}
                    onRemoveSection={removeSection}
                    onRemoveQuestion={removeQuestion}
                    onQuestionDrop={addQuestionToSection}
                />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="30%">
                <QuestionBank
                    chapters={chapters}
                    activeSection={activeSection}
                    onAddQuestion={addQuestionToActiveSection}
                />
            </ResizablePanel>
        </ResizablePanelGroup>

    );
};

export default GeneratePage;