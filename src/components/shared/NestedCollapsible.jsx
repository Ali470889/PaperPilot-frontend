import React, { useState } from "react"
import { ChevronRight, BookOpen, FileText, HelpCircle } from "lucide-react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

const NestedCollapsible = ({ data }) => {
    return (
        <div className="max-w-3xl mx-auto p-4 space-y-4">
            {data.map((chapter) => (
                <ChapterItem key={chapter.id} chapter={chapter} />
            ))}
        </div>
    )
}

// Chapter Component
const ChapterItem = ({ chapter }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full border rounded-xl overflow-hidden shadow-sm">
            <CollapsibleTrigger className="flex w-full items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-all text-left">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Chapter {chapter.number}</p>
                        <h3 className="font-bold text-lg capitalize leading-tight">{chapter.name}</h3>
                    </div>
                </div>
                <ChevronRight className={cn("h-5 w-5 transition-transform duration-200", isOpen && "rotate-90")} />
            </CollapsibleTrigger>

            <CollapsibleContent className="bg-white px-4 pb-4">
                <div className="mt-4 space-y-2 border-l-2 border-slate-100 ml-5 pl-4">
                    {chapter.topics.length > 0 ? (
                        chapter.topics.map((topic) => (
                            <TopicItem key={topic.id} topic={topic} />
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground italic">No topics found.</p>
                    )}
                </div>
            </CollapsibleContent>
        </Collapsible>
    )
}

// Topic Component (Nested)
const TopicItem = ({ topic }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
            <CollapsibleTrigger className="flex w-full items-center justify-between py-2 group text-left">
                <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <span className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{topic.name}</span>
                </div>
                <ChevronRight className={cn("h-4 w-4 text-slate-400 transition-transform duration-200", isOpen && "rotate-90")} />
            </CollapsibleTrigger>

            <CollapsibleContent className="pl-6 pt-1 pb-3">
                <ul className="space-y-3">
                    {topic.questions.map((q) => (
                        <li key={q.id} className="flex items-start gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors cursor-default">
                            <HelpCircle className="h-4 w-4 mt-0.5 text-slate-300 shrink-0" />
                            <span>{q.text}</span>
                        </li>
                    ))}
                </ul>
            </CollapsibleContent>
        </Collapsible>
    )
}

export default NestedCollapsible