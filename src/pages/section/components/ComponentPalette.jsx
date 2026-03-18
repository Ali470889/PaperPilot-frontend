import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SeparatorHorizontal, TextCursorInput, HelpCircle } from "lucide-react";
import { useGetQuestionTypes } from "@/hooks/useFetchQuestionType";

const COMPONENT_TYPES = [
    {
        type: "separation",
        label: "Separation",
        icon: SeparatorHorizontal,
        description: "A separator line between parts",
    },
    {
        type: "statement",
        label: "Statement",
        icon: TextCursorInput,
        description: "Instruction text for students",
    },
    {
        type: "question",
        label: "Question Block",
        icon: HelpCircle,
        description: "A block of questions with count",
    },
];

const DraggableBlock = ({ type, label, icon: Icon, description }) => {
    const handleDragStart = (e) => {
        e.dataTransfer.setData(
            "application/section-component",
            JSON.stringify({ type })
        );
        e.dataTransfer.effectAllowed = "copy";
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            className="flex items-center gap-3 rounded-md border bg-background p-3 cursor-grab active:cursor-grabbing hover:border-primary hover:bg-accent/30 transition-colors"
        >
            <Icon className="h-5 w-5 text-primary shrink-0" />
            <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
        </div>
    );
};

const ComponentPalette = ({
    sectionName,
    onSectionNameChange,
    questionTypeId,
    onQuestionTypeChange,
}) => {
    const { data: qtData } = useGetQuestionTypes({ page: 1, size: 100 });
    const questionTypes = qtData?.questionTypes || qtData?.items || [];

    return (
        <Card className="h-full w-full overflow-hidden rounded-none border-0">
            <CardHeader>
                <CardTitle>Section Config</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
                <div className="space-y-2">
                    <Label>Section Name</Label>
                    <Input
                        placeholder="e.g. Section A"
                        value={sectionName}
                        onChange={(e) => onSectionNameChange(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Question Type</Label>
                    <Select
                        value={questionTypeId ? String(questionTypeId) : ""}
                        onValueChange={(val) => onQuestionTypeChange(Number(val))}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select question type" />
                        </SelectTrigger>
                        <SelectContent>
                            {questionTypes.map((qt) => (
                                <SelectItem key={qt.id} value={String(qt.id)}>
                                    {qt.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Components</Label>
                    <p className="text-xs text-muted-foreground">
                        Drag components into the builder area
                    </p>
                    <div className="space-y-2">
                        {COMPONENT_TYPES.map((comp) => (
                            <DraggableBlock key={comp.type} {...comp} />
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ComponentPalette;
