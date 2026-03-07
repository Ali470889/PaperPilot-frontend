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
import { StateDisplay } from "../../../components/shared/StateDisplay";
import { useGetBookById } from "../../../hooks/useFetchBook";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const SECTION_TYPES = [
    { value: "short", label: "Short Question" },
    { value: "long", label: "Long Question" },
    { value: "mcq", label: "MCQ" },
];

const createSection = (index, payload = {}) => ({
    id: `section-${Date.now()}-${index}`,
    title: `Section ${String.fromCharCode(65 + index)}`,
    sectionType: payload.sectionType ?? "short",
    sectionStatement: payload.sectionStatement ?? "",
    totalQuestions: Number(payload.totalQuestions ?? 1),
    marksPerQuestion: Number(payload.marksPerQuestion ?? 2),
    choiceCount: Number(payload.choiceCount ?? 0),
    questions: [],
});

const getAttemptQuestions = (section) =>
    Math.max(0, Number(section.totalQuestions || 0) - Number(section.choiceCount || 0));

const getTotalMarks = (section) =>
    getAttemptQuestions(section) * Number(section.marksPerQuestion || 0);

const GeneratePage = () => {
    const { bookId } = useParams();
    const { data, isLoading, isError, refetch } = useGetBookById(bookId);

    const chapters = useMemo(() => data?.data?.chapters ?? [], [data]);

    const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);

    const [paperStructure, setPaperStructure] = useState([]);
    const [activeSectionId, setActiveSectionId] = useState();

    console.log("paperStructure", paperStructure);



    const [sectionForm, setSectionForm] = useState({
        totalQuestions: 1,
        sectionType: "short",
        sectionStatement: "",
        marksPerQuestion: 2,
        choiceCount: 0,
    });

    const resetSectionForm = () => {
        setSectionForm({
            totalQuestions: 1,
            sectionType: "short",
            sectionStatement: "",
            marksPerQuestion: 2,
            choiceCount: 0,
        });
    };

    const openAddSectionDialog = () => {
        resetSectionForm();
        setIsSectionDialogOpen(true);
    };

    const saveSectionFromDialog = () => {
        const totalQuestions = Number(sectionForm.totalQuestions || 0);
        const marksPerQuestion = Number(sectionForm.marksPerQuestion || 0);
        const choiceCount = Number(sectionForm.choiceCount || 0);

        if (totalQuestions < 1 || marksPerQuestion < 1 || choiceCount < 0 || choiceCount >= totalQuestions) {
            return;
        }

        setPaperStructure((prev) => {
            const next = [
                ...prev,
                createSection(prev.length, {
                    ...sectionForm,
                    totalQuestions,
                    marksPerQuestion,
                    choiceCount,
                }),
            ];
            setActiveSectionId(next[next.length - 1].id);
            return next;
        });

        setIsSectionDialogOpen(false);
        resetSectionForm();
    };


    const removeSectionById = (id) => {
        setPaperStructure((prev) => prev.filter((section) => section.id !== id));
    };



    const activeSection = useMemo(
        () => paperStructure.find((section) => section.id === activeSectionId) ?? null,
        [paperStructure, activeSectionId]
    );

    const addSection = () => {
        setPaperStructure((prev) => {
            const next = [...prev, createSection(prev.length)];
            setActiveSectionId(next[next.length - 1].id);
            return next;
        });
    };

    const addQuestionToActiveSection = (chapter, topic, question) => {
        if (!activeSectionId) return;

        const normalizedQuestion = {
            instanceId: `sq-${question?.id ?? "q"}-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 7)}`,
            sourceQuestionId: question?.id,
            chapterId: chapter?.id,
            chapterName: chapter?.name,
            topicId: topic?.id,
            topicName: topic?.name,
            text: question?.text,
        };

        setPaperStructure((prev) =>
            prev.map((section) =>
                section.id === activeSectionId
                    ? { ...section, questions: [...section.questions, normalizedQuestion] }
                    : section
            )
        );
    };

    const removeQuestionFromSection = (sectionId, instanceId) => {
        setPaperStructure((prev) =>
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

    const reorderQuestion = (sectionId, questionIndex, direction) => {
        setPaperStructure((prev) =>
            prev.map((section) => {
                if (section.id !== sectionId) return section;

                const targetIndex = questionIndex + direction;
                if (targetIndex < 0 || targetIndex >= section.questions.length) return section;

                const nextQuestions = [...section.questions];
                const [moved] = nextQuestions.splice(questionIndex, 1);
                nextQuestions.splice(targetIndex, 0, moved);

                return { ...section, questions: nextQuestions };
            })
        );
    };

    return (
        <>
            <ResizablePanelGroup orientation="horizontal" className="rounded-lg border min-h-[80vh]">
                <ResizablePanel defaultSize={65}>
                    <div className="h-full w-full p-4 md:p-6 flex flex-col gap-4 bg-background">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Question Paper Editor</h2>
                            <Button onClick={openAddSectionDialog} className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Section
                            </Button>
                        </div>

                        {!activeSection && (
                            <StateDisplay
                                state="not-found"
                                title="No Active Section"
                                message="Create or select a section to start adding questions."
                            />
                        )}

                        <div className="space-y-3">
                            {paperStructure.map((section, index) => {
                                const isActive = section.id === activeSectionId;

                                return (
                                    <div
                                        key={section.id}
                                        onClick={() => setActiveSectionId(section.id)}
                                        className={[
                                            "p-4 transition cursor-pointer flex flex-col gap-4 ",
                                            isActive
                                                ? "border-primary bg-accent/40 ring-1 ring-primary"
                                                : "border-border hover:border-primary/40",
                                        ].join(" ")}
                                    >
                                        <div className="flex flex-col gap-4 relative ">
                                            <div className="flex w-full justify-center" >
                                                <h3 className="font-medium">
                                                    {section.title}
                                                    {isActive ? " (Active)" : ""}
                                                </h3>
                                            </div>

                                            <div className="flex w-full justify-between">
                                                <div className="flex gap-2">
                                                    <span> {index + 1}.</span>
                                                    <span>{section.sectionStatement}</span>
                                                </div>
                                                <span>{(section.totalQuestions - section.choiceCount) * section.marksPerQuestion}  </span>
                                            </div>

                                            {/* <span className="text-xs text-muted-foreground">
                                                {section.questions.length} question(s)
                                            </span> */}
                                            {/* <span>{section.sectionStatement}</span> */}
                                            {/* <span>{section.choiceCount}</span>
                                            <span>{section.marksPerQuestion}</span>
                                            <span>{section.sectionType}</span>
                                            <span>{section.totalQuestions}</span> */}

                                            <Button
                                                variant="outline"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeSectionById(section.id);
                                                }}
                                                className="w-fit self-end absolute top-0 right-0"
                                            >
                                                <Trash2Icon className="text-destructive" />
                                            </Button>
                                        </div>

                                        {section.questions.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">
                                                No questions yet. Select this section and add from the question bank.
                                            </p>
                                        ) : (
                                            <ul className="space-y-2">
                                                {section.questions.map((q, index) => (
                                                    <li
                                                        key={q.instanceId}
                                                        className="rounded border bg-background p-2 flex items-start justify-between gap-3"
                                                    >
                                                        <div className="text-sm">
                                                            <p className="font-medium">
                                                                Q{index + 1}. {q.text}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {q.chapterName} / {q.topicName}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center gap-1">
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    reorderQuestion(section.id, index, -1);
                                                                }}
                                                                disabled={index === 0}
                                                                title="Move up"
                                                            >
                                                                <ArrowUp className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    reorderQuestion(section.id, index, 1);
                                                                }}
                                                                disabled={index === section.questions.length - 1}
                                                                title="Move down"
                                                            >
                                                                <ArrowDown className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="icon"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    removeQuestionFromSection(section.id, q.instanceId);
                                                                }}
                                                                title="Remove question"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                <ResizablePanel defaultSize={35}>
                    <div className="h-full w-full p-3 md:p-4">
                        {isError && (
                            <StateDisplay
                                state="error"
                                title="Connection Failed"
                                message="We couldn't reach the server. Check your internet."
                                onRetry={() => refetch()}
                            />
                        )}

                        {isLoading && (
                            <StateDisplay
                                state="loading"
                                title="Loading..."
                                message="Fetching chapters and questions. Please wait."
                            />
                        )}

                        {!isLoading && !isError && chapters.length === 0 && (
                            <StateDisplay
                                state="not-found"
                                title="No Chapters Found"
                                message="No question bank data is available for this book."
                            />
                        )}

                        {!isLoading && !isError && chapters.length > 0 && (
                            <div className="space-y-3">
                                <div className="rounded-md border p-3 bg-accent/30">
                                    <p className="text-sm font-medium">Question Bank</p>
                                    <p className="text-xs text-muted-foreground">
                                        {activeSection
                                            ? `Adding to: ${activeSection.title}`
                                            : "Select a section on the left to enable Add buttons."}
                                    </p>
                                </div>

                                <Accordion type="multiple" className="w-full flex flex-col gap-3">
                                    {chapters.map((chapter) => (
                                        <AccordionItem
                                            key={chapter.id}
                                            value={`chapter-${chapter.id}`}
                                            className="border-b-0 flex flex-col gap-2"
                                        >
                                            <AccordionTrigger className="bg-accent py-2 px-3 rounded">
                                                <div className="flex items-center gap-2 text-sm font-medium">
                                                    <BookOpen className="h-4 w-4 text-primary" />
                                                    <span>
                                                        Chapter {chapter.number}: {chapter.name}
                                                    </span>
                                                </div>
                                            </AccordionTrigger>

                                            <AccordionContent className="pb-0">
                                                {(chapter.topics ?? []).length > 0 ? (
                                                    <Accordion
                                                        type="multiple"
                                                        className="w-full ml-3 border-l-2 pl-3 flex flex-col gap-2"
                                                    >
                                                        {(chapter.topics ?? []).map((topic) => (
                                                            <AccordionItem
                                                                key={topic.id}
                                                                value={`topic-${topic.id}`}
                                                                className="border-none flex flex-col gap-2"
                                                            >
                                                                <AccordionTrigger className="py-1 px-2 bg-accent rounded">
                                                                    <div className="flex items-center gap-2 text-sm font-medium">
                                                                        <FileText className="h-4 w-4" />
                                                                        {topic.name}
                                                                    </div>
                                                                </AccordionTrigger>

                                                                <AccordionContent className="flex flex-col gap-2 pb-0">
                                                                    <ul className="flex flex-col gap-2">
                                                                        {(topic.questions ?? []).map((q) => (
                                                                            <li
                                                                                key={q.id}
                                                                                className="rounded border p-2 flex items-start justify-between gap-2"
                                                                            >
                                                                                <div className="flex items-start gap-2 text-sm">
                                                                                    <HelpCircle className="h-4 w-4 mt-0.5 text-slate-400" />
                                                                                    <span>{q?.text?.question ?? "Untitled question"}</span>
                                                                                </div>
                                                                                <Button
                                                                                    size="sm"
                                                                                    onClick={() => addQuestionToActiveSection(chapter, topic, q)}
                                                                                    disabled={
                                                                                        !activeSection ||
                                                                                        activeSection.questions.length >= Number(activeSection.totalQuestions || 0)
                                                                                    }
                                                                                >
                                                                                    Add
                                                                                </Button>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                        ))}
                                                    </Accordion>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground italic ml-6 py-2">
                                                        No topics found in this chapter.
                                                    </p>
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        )}
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
            <Dialog open={isSectionDialogOpen} onOpenChange={setIsSectionDialogOpen}>
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle>Add Section</DialogTitle>
                        <DialogDescription>
                            Define section rules. Marks are auto-calculated from attempts.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="totalQuestions">Total Questions</Label>
                            <Input
                                id="totalQuestions"
                                type="number"
                                min={1}
                                value={sectionForm.totalQuestions}
                                onChange={(e) =>
                                    setSectionForm((prev) => ({ ...prev, totalQuestions: e.target.value }))
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Section Type</Label>
                            <Select
                                value={sectionForm.sectionType}
                                onValueChange={(value) => setSectionForm((prev) => ({ ...prev, sectionType: value }))}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select section type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SECTION_TYPES.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="sectionStatement">Section Statement</Label>
                            <Textarea
                                id="sectionStatement"
                                placeholder="Write instructions for this section"
                                value={sectionForm.sectionStatement}
                                onChange={(e) =>
                                    setSectionForm((prev) => ({ ...prev, sectionStatement: e.target.value }))
                                }
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="marksPerQuestion">Marks Per Question</Label>
                                <Input
                                    id="marksPerQuestion"
                                    type="number"
                                    min={1}
                                    value={sectionForm.marksPerQuestion}
                                    onChange={(e) =>
                                        setSectionForm((prev) => ({ ...prev, marksPerQuestion: e.target.value }))
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="choiceCount">Choice Count</Label>
                                <Input
                                    id="choiceCount"
                                    type="number"
                                    min={0}
                                    value={sectionForm.choiceCount}
                                    onChange={(e) =>
                                        setSectionForm((prev) => ({ ...prev, choiceCount: e.target.value }))
                                    }
                                />
                            </div>
                        </div>

                        <div className="rounded-md border p-3 bg-accent/30 text-sm">
                            <p>
                                Attempt Questions:{" "}
                                <span className="font-semibold">
                                    {Math.max(0, Number(sectionForm.totalQuestions || 0) - Number(sectionForm.choiceCount || 0))}
                                </span>
                            </p>
                            <p>
                                Total Marks:{" "}
                                <span className="font-semibold">
                                    {Math.max(0, Number(sectionForm.totalQuestions || 0) - Number(sectionForm.choiceCount || 0)) *
                                        Number(sectionForm.marksPerQuestion || 0)}
                                </span>
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsSectionDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={saveSectionFromDialog}>Save Section</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default GeneratePage;

