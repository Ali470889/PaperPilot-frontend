import { useState, useCallback } from "react";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { toast } from "sonner";

import { useCreateSection, useUpdateSection } from "@/hooks/useFetchSection";

import SectionList from "./components/SectionList";
import SectionBuilder from "./components/SectionBuilder";
import ComponentPalette from "./components/ComponentPalette";

// Generate a unique component id
const genId = () =>
    `comp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// Create a new empty component of the given type
const createComponent = (type) => {
    const base = { id: genId(), type };
    if (type === "question") return { ...base, count: 0, questions: [] };
    return { ...base, value: "" };
};

const SectionPage = () => {
    // ── Mode: "list" | "create" | "edit" ──
    const [mode, setMode] = useState("list");
    const [editingSectionId, setEditingSectionId] = useState(null);

    // ── Builder state ──
    const [sectionName, setSectionName] = useState("");
    const [questionTypeId, setQuestionTypeId] = useState(null);
    const [components, setComponents] = useState([]);

    const createMutation = useCreateSection();
    const updateMutation = useUpdateSection();

    // ── Reset builder to blank ──
    const resetBuilder = useCallback(() => {
        setSectionName("");
        setQuestionTypeId(null);
        setComponents([]);
        setEditingSectionId(null);
    }, []);

    // ── Switch to create mode ──
    const handleCreateNew = useCallback(() => {
        resetBuilder();
        setMode("create");
    }, [resetBuilder]);

    // ── Switch to edit mode and populate builder ──
    const handleEdit = useCallback((section) => {
        setSectionName(section.name || "");
        setQuestionTypeId(section.questionTypeId ?? section.questionType?.id ?? null);
        setEditingSectionId(section.id);

        // Parse the section components from the stored data
        const sectionData = section.section;
        if (Array.isArray(sectionData)) {
            // Already in array format
            setComponents(
                sectionData.map((c) => ({ ...c, id: c.id || genId() }))
            );
        } else if (sectionData && typeof sectionData === "object") {
            // Legacy fixed-schema format — convert to array
            const parsed = [];
            if (sectionData.separation !== undefined)
                parsed.push({ id: genId(), type: "separation", value: sectionData.separation });
            if (sectionData.statement !== undefined)
                parsed.push({ id: genId(), type: "statement", value: sectionData.statement });
            if (sectionData.question !== undefined)
                parsed.push({
                    id: genId(),
                    type: "question",
                    count: Array.isArray(sectionData.question) ? sectionData.question.length : 0,
                    questions: sectionData.question || [],
                });
            if (sectionData.separation2 !== undefined)
                parsed.push({ id: genId(), type: "separation", value: sectionData.separation2 });
            if (sectionData.statement2 !== undefined)
                parsed.push({ id: genId(), type: "statement", value: sectionData.statement2 });
            if (sectionData.question2 !== undefined)
                parsed.push({
                    id: genId(),
                    type: "question",
                    count: Array.isArray(sectionData.question2) ? sectionData.question2.length : 0,
                    questions: sectionData.question2 || [],
                });
            setComponents(parsed);
        } else {
            setComponents([]);
        }

        setMode("edit");
    }, []);

    // ── Cancel: go back to list ──
    const handleCancel = useCallback(() => {
        resetBuilder();
        setMode("list");
    }, [resetBuilder]);

    // ── Add a component to the builder ──
    const handleAddComponent = useCallback((type, atIndex) => {
        const newComp = createComponent(type);
        setComponents((prev) => {
            if (atIndex !== undefined && atIndex >= 0) {
                const next = [...prev];
                next.splice(atIndex, 0, newComp);
                return next;
            }
            return [...prev, newComp];
        });
    }, []);

    // ── Remove a component ──
    const handleRemoveComponent = useCallback((id) => {
        setComponents((prev) => prev.filter((c) => c.id !== id));
    }, []);

    // ── Update a component's fields ──
    const handleUpdateComponent = useCallback((id, updates) => {
        setComponents((prev) =>
            prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
        );
    }, []);

    // ── Reorder components via drag-and-drop ──
    const handleReorderComponents = useCallback((fromIndex, toIndex) => {
        setComponents((prev) => {
            const next = [...prev];
            const [moved] = next.splice(fromIndex, 1);
            next.splice(toIndex, 0, moved);
            return next;
        });
    }, []);

    // ── Save (create or update) ──
    const handleSave = useCallback(() => {
        if (!sectionName.trim()) {
            toast.error("Section name is required");
            return;
        }
        if (!questionTypeId) {
            toast.error("Please select a question type");
            return;
        }

        // Serialize components array as the section payload
        const sectionPayload = components.map(({ id, ...rest }) => rest);

        const payload = {
            name: sectionName.trim(),
            section: sectionPayload,
            questionTypeId,
        };

        if (mode === "edit" && editingSectionId) {
            updateMutation.mutate(
                { id: editingSectionId, ...payload },
                {
                    onSuccess: () => {
                        toast.success("Section updated successfully");
                        resetBuilder();
                        setMode("list");
                    },
                    onError: () => toast.error("Failed to update section"),
                }
            );
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => {
                    toast.success("Section created successfully");
                    resetBuilder();
                    setMode("list");
                },
                onError: () => toast.error("Failed to create section"),
            });
        }
    }, [
        sectionName,
        questionTypeId,
        components,
        mode,
        editingSectionId,
        createMutation,
        updateMutation,
        resetBuilder,
    ]);

    const isSaving = createMutation.isPending || updateMutation.isPending;

    // ── List-only view ──
    if (mode === "list") {
        return (
            <div className="h-full w-full">
                <SectionList onCreateNew={handleCreateNew} onEdit={handleEdit} />
            </div>
        );
    }

    // ── Create / Edit view: 3-panel split ──
    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="rounded-lg h-full w-full gap-2 border"
        >
            {/* Left: Sections list */}
            <ResizablePanel defaultSize={20} minSize={15}>
                <SectionList onCreateNew={handleCreateNew} onEdit={handleEdit} />
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Center: Builder */}
            <ResizablePanel defaultSize={55} minSize={30}>
                <SectionBuilder
                    components={components}
                    mode={mode}
                    onAddComponent={handleAddComponent}
                    onRemoveComponent={handleRemoveComponent}
                    onUpdateComponent={handleUpdateComponent}
                    onReorderComponents={handleReorderComponents}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isSaving={isSaving}
                />
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Right: Component palette */}
            <ResizablePanel defaultSize={25} minSize={15}>
                <ComponentPalette
                    sectionName={sectionName}
                    onSectionNameChange={setSectionName}
                    questionTypeId={questionTypeId}
                    onQuestionTypeChange={setQuestionTypeId}
                />
            </ResizablePanel>
        </ResizablePanelGroup>
    );
};

export default SectionPage;
