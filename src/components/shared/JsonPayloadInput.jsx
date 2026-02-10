import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// import { Alert, AlertDescription } from "@/components/ui/alert";

export default function JsonPayloadInput({
    title = "Extra JSON Payload",
    label = "JSON",
    initialValue = {},
    placeholder = '{ "key": "value" }',
    disabled = false,

    // Called with parsed object when JSON is valid
    onValidJson,

    // Called when invalid (optional)
    onInvalidJson,

    // UI options
    showFormatButton = true,
    rows = 10,
    className = "",
}) {
    const initialText = useMemo(
        () => (typeof initialValue === "string" ? initialValue : JSON.stringify(initialValue, null, 2)),
        [initialValue]
    );

    const [text, setText] = useState(initialText);
    const [error, setError] = useState("");

    useEffect(() => {
        // Keep in sync if parent changes initialValue
        setText(initialText);
    }, [initialText]);

    const parseAndEmit = (value) => {
        try {
            const parsed = JSON.parse(value);
            setError("");
            onValidJson?.(parsed);
            return parsed;
        } catch (e) {
            setError("Invalid JSON. Please fix formatting (quotes, commas, braces).");
            onInvalidJson?.(e);
            return null;
        }
    };

    const handleChange = (value) => {
        setText(value);
        parseAndEmit(value);
    };

    const handleFormat = () => {
        const parsed = parseAndEmit(text);
        if (parsed) setText(JSON.stringify(parsed, null, 2));
    };

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                <Textarea
                    value={text}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={rows}
                    className={`font-mono ${error ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />

                <div className="flex items-center gap-2">
                    {showFormatButton ? (
                        <Button type="button" variant="secondary" onClick={handleFormat} disabled={disabled}>
                            Format JSON
                        </Button>
                    ) : null}
                </div>
            </CardContent>
        </Card>
    );
}
