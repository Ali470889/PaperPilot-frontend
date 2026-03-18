import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StateDisplay } from "@/components/shared/StateDisplay";
import SectionComponentItem from "./SectionComponentItem";

const SectionBuilder = ({
    components,
    mode,
    onAddComponent,
    onRemoveComponent,
    onUpdateComponent,
    onReorderComponents,
    onSave,
    onCancel,
    isSaving,
}) => {
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [draggingIndex, setDraggingIndex] = useState(null);
    const [overIndex, setOverIndex] = useState(null);

    // Handle drops from the component palette (new component)
    const handleBuilderDragOver = (e) => {
        e.preventDefault();
        setIsDraggingOver(true);
    };

    const handleBuilderDragLeave = (e) => {
        // Only clear if leaving the builder area entirely
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsDraggingOver(false);
        }
    };

    const handleBuilderDrop = (e) => {
        e.preventDefault();
        setIsDraggingOver(false);

        // Check for palette component drop
        const paletteData = e.dataTransfer.getData("application/section-component");
        if (paletteData) {
            try {
                const { type } = JSON.parse(paletteData);
                onAddComponent(type);
            } catch {
                // ignore invalid
            }
            return;
        }
    };

    // Reorder handlers for items within the builder
    const handleItemDragStart = (e, index) => {
        setDraggingIndex(index);
        e.dataTransfer.setData(
            "application/section-builder-item",
            JSON.stringify({ fromIndex: index })
        );
        e.dataTransfer.effectAllowed = "move";
    };

    const handleItemDragEnd = () => {
        setDraggingIndex(null);
        setOverIndex(null);
    };

    const handleItemDragOver = (e, index) => {
        e.preventDefault();
        setOverIndex(index);
    };

    const handleItemDrop = (e, dropIndex) => {
        e.preventDefault();
        e.stopPropagation();

        const reorderData = e.dataTransfer.getData("application/section-builder-item");
        if (reorderData) {
            try {
                const { fromIndex } = JSON.parse(reorderData);
                if (Number.isInteger(fromIndex) && fromIndex !== dropIndex) {
                    onReorderComponents(fromIndex, dropIndex);
                }
            } catch {
                // ignore
            }
        }

        // Also check for palette drop on a specific item position
        const paletteData = e.dataTransfer.getData("application/section-component");
        if (paletteData) {
            try {
                const { type } = JSON.parse(paletteData);
                onAddComponent(type, dropIndex);
            } catch {
                // ignore
            }
        }

        setDraggingIndex(null);
        setOverIndex(null);
    };

    return (
        <Card className="h-full w-full overflow-hidden rounded-none border-0 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                    {mode === "edit" ? "Edit Section" : "Build Section"}
                </CardTitle>
            </CardHeader>

            <CardContent
                className="flex-1 overflow-hidden"
                onDragOver={handleBuilderDragOver}
                onDragLeave={handleBuilderDragLeave}
                onDrop={handleBuilderDrop}
            >
                {components.length === 0 ? (
                    <div
                        className={[
                            "flex min-h-[300px] flex-col items-center justify-center rounded-md border-2 border-dashed p-8 text-center transition-colors",
                            isDraggingOver
                                ? "border-primary bg-accent/50"
                                : "border-muted-foreground/25",
                        ].join(" ")}
                    >
                        <p className="text-sm text-muted-foreground">
                            Drag components from the right panel to start building
                        </p>
                    </div>
                ) : (
                    <ScrollArea className="pr-3 h-full">
                        <div
                            className={[
                                "space-y-2 min-h-[200px] rounded-md p-2 transition-colors",
                                isDraggingOver
                                    ? "bg-accent/30 ring-1 ring-primary/30 ring-dashed"
                                    : "",
                            ].join(" ")}
                        >
                            {components.map((comp, index) => (
                                <SectionComponentItem
                                    key={comp.id}
                                    component={comp}
                                    index={index}
                                    draggingIndex={draggingIndex}
                                    overIndex={overIndex}
                                    onUpdate={onUpdateComponent}
                                    onRemove={onRemoveComponent}
                                    onDragStart={handleItemDragStart}
                                    onDragEnd={handleItemDragEnd}
                                    onDragOver={handleItemDragOver}
                                    onDrop={handleItemDrop}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>

            <CardFooter className="flex justify-end gap-2 border-t pt-4">
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button onClick={onSave} disabled={isSaving}>
                    {isSaving
                        ? "Saving..."
                        : mode === "edit"
                            ? "Update Section"
                            : "Create Section"}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default SectionBuilder;
