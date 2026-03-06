// import React, { useState } from 'react';
// import { ChevronDown, ChevronRight } from 'lucide-react';

// const NestedAccordion = ({ data }) => {
//     const [openChapters, setOpenChapters] = useState({});
//     const [openTopics, setOpenTopics] = useState({});

//     const toggleChapter = (id) => {
//         setOpenChapters(prev => ({ ...prev, [id]: !prev[id] }));
//     };

//     const toggleTopic = (id) => {
//         setOpenTopics(prev => ({ ...prev, [id]: !prev[id] }));
//     };

//     return (
//         <div className="max-w-2xl mx-auto p-4 space-y-2">
//             {data.map((chapter) => (
//                 <div key={chapter.id} className="border rounded-lg overflow-hidden border-slate-200">
//                     {/* Chapter Level */}
//                     <button
//                         onClick={() => toggleChapter(chapter.id)}
//                         className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
//                     >
//                         <span className="font-bold text-lg capitalize">
//                             Chapter {chapter.number}: {chapter.name}
//                         </span>
//                         {openChapters[chapter.id] ? <ChevronDown /> : <ChevronRight />}
//                     </button>

//                     {openChapters[chapter.id] && (
//                         <div className="p-2 bg-white space-y-2">
//                             {chapter.topics.length > 0 ? (
//                                 chapter.topics.map((topic) => (
//                                     <div key={topic.id} className="ml-4 border-l-2 border-blue-200">
//                                         {/* Topic Level */}
//                                         <button
//                                             onClick={() => toggleTopic(topic.id)}
//                                             className="w-full flex items-center justify-between p-3 hover:bg-blue-50 transition-colors"
//                                         >
//                                             <span className="font-semibold text-blue-700">{topic.name}</span>
//                                             {openTopics[topic.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
//                                         </button>

//                                         {openTopics[topic.id] && (
//                                             <ul className="ml-8 p-2 space-y-2">
//                                                 {topic.questions.map((q) => (
//                                                     <li key={q.id} className="text-gray-600 list-disc text-sm">
//                                                         {q.text}
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         )}
//                                     </div>
//                                 ))
//                             ) : (
//                                 <p className="text-gray-400 italic ml-4">No topics available.</p>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             ))}
//         </div>
//     );a
// };

// export default NestedAccordion;


import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"; // Adjust path based on your setup
import { BookOpen, FileText, HelpCircle } from "lucide-react";

const NestedAccordion = ({ data }) => {
    return (
        <div className="">
            {/* Chapter Level - Root Accordion */}
            <Accordion type="multiple" className="w-full flex flex-col gap-3">
                {data.map((chapter) => (
                    <AccordionItem
                        key={chapter.id}
                        value={`chapter-${chapter.id}`}
                        className="border-b-0 flex flex-col gap-3"
                    >
                        <AccordionTrigger className="bg-accent py-2 px-4 ">
                            <div className="flex items-center gap-3">
                                <BookOpen className="h-4 w-4 text-primary" />
                                <span className="capitalize">
                                    Chapter {chapter.number}: {chapter.name}
                                </span>
                            </div>
                        </AccordionTrigger>

                        <AccordionContent className="pb-0">
                            {chapter.topics.length > 0 ? (
                                /* Topic Level - Nested Accordion */
                                <Accordion type="multiple" className="w-full ml-4 border-l-2 pl-4 flex flex-col gap-2">
                                    {chapter.topics.map((topic) => (
                                        <AccordionItem
                                            key={topic.id}
                                            value={`topic-${topic.id}`}
                                            className="border-none flex flex-col gap-2"
                                        >
                                            <AccordionTrigger className="py-1 px-2 bg-accent">
                                                <div className="flex items-center gap-2 text-base font-medium">
                                                    <FileText className="h-4 w-4" />
                                                    {topic.name}
                                                </div>
                                            </AccordionTrigger>

                                            <AccordionContent className="flex flex-col gap-2">
                                                {/* Question Level - Simple List */}
                                                <ul className="mt-2 space-y-3 ml-6">
                                                    {topic.questions.map((q) => (
                                                        <li
                                                            key={q.id}
                                                            className="flex items-start gap-2 text-sm text-muted-foreground group"
                                                        >
                                                            <HelpCircle className="h-4 w-4 mt-0.5 text-slate-400 group-hover:text-primary transition-colors" />
                                                            <span>{q.text.question}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            ) : (
                                <p className="text-sm text-muted-foreground italic ml-8 py-2">
                                    No topics found in this chapter.
                                </p>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default NestedAccordion;