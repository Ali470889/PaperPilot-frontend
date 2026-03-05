import * as React from "react"
import {
    Loader2,
    AlertCircle,
    SearchX,
    CheckCircle2,
    RefreshCcw
} from "lucide-react"
import { cn } from "@/lib/utils"


const stateConfig = {
    loading: {
        icon: Loader2,
        iconClass: "animate-spin text-primary",
        defaultTitle: "Loading...",
    },
    error: {
        icon: AlertCircle,
        iconClass: "text-destructive",
        defaultTitle: "Something went wrong",
    },
    "not-found": {
        icon: SearchX,
        iconClass: "text-muted-foreground",
        defaultTitle: "No results found",
    },
    success: {
        icon: CheckCircle2,
        iconClass: "text-green-500",
        defaultTitle: "Success!",
    },
}

export function StateDisplay({
    state,
    title,
    message,
    className,
    onRetry,
}) {
    const config = stateConfig[state]
    const Icon = config.icon

    return (
        <div className={cn(
            "flex min-h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in duration-500",
            className
        )}>
            <Icon className={cn("h-10 w-10 mb-4", config.iconClass)} />
            <h3 className="font-semibold text-lg tracking-tight">
                {title || config.defaultTitle}
            </h3>
            {message && (
                <p className="mt-2 text-sm text-muted-foreground max-w-[250px]">
                    {message}
                </p>
            )}

            {state === "error" && onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                    <RefreshCcw className="h-4 w-4" />
                    Try again
                </button>
            )}
        </div>
    )
}