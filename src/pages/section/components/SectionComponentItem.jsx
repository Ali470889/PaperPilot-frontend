import { useState } from "react";
import { GripVertical, Trash2, SeparatorHorizontal, TextCursorInput, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const typeConfig = {
    separation: {
        icon: SeparatorHorizontal,
        label: "Separation",
        color: "text-orange-500",
    },
    statement: {
        icon: TextCursorInput,
        label: "Statement",
        color: "text-blue-500",
    },
    question: {
        icon: HelpCircle,
        label: "Question Block",
        color: "text-green-500",
    },
};

const SectionComponentItem = ({
    component,
    index,
    draggingIndex,
    overIndex,
    onUpdate,
    onRemove,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
}) => {
    const config = typeConfig[component.type] || typeConfig.separation;
    const Icon = config.icon;

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragEnd={onDragEnd}
            onDragOver={(e) => onDragOver(e, index)}
            onDrop={(e) => onDrop(e, index)}
            className={[
                "rounded-md border bg-background p-3 transition-all",
                draggingIndex === index ? "opacity-50" : "",
                overIndex === index
                    ? "border-primary ring-1 ring-primary/40"
                    : "",
            ].join(" ")}
        >
            <div className="flex items-start gap-2">
                <div className="cursor-grab active:cursor-grabbing pt-1">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Icon
                                className={`h-4 w-4 ${config.color}`}
                            />
                            <span className="text-sm font-medium">
                                {config.label}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => onRemove(component.id)}
                        >
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>

                    {component.type === "separation" && (
                        <Input
                            placeholder="Separator text (e.g. ────── Part B ──────)"
                            value={component.value || ""}
                            onChange={(e) =>
                                onUpdate(component.id, {
                                    value: e.target.value,
                                })
                            }
                        />
                    )}

                    {component.type === "statement" && (
                        <Textarea
                            placeholder="Enter statement / instruction text..."
                            value={component.value || ""}
                            rows={2}
                            onChange={(e) =>
                                onUpdate(component.id, {
                                    value: e.target.value,
                                })
                            }
                        />
                    )}

                    {component.type === "question" && (
                        <div className="flex items-center gap-2">
                            <Label className="text-xs whitespace-nowrap">
                                Question Count:
                            </Label>
                            <Input
                                type="number"
                                min={0}
                                className="w-24"
                                placeholder="0"
                                value={component.count ?? ""}
                                onChange={(e) =>
                                    onUpdate(component.id, {
                                        count: parseInt(e.target.value) || 0,
                                    })
                                }
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SectionComponentItem;
