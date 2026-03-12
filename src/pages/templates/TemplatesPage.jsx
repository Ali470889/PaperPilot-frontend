import { BlockMath, InlineMath } from 'react-katex';
import MathText from '../../components/shared/MathText';

const paperData = {
    metadata: {
        title: "ENGLISH (COMPULSORY)",
        exam: "024-1st Annual-(9TH CLASS)",
        session: "2020-2022 to 2023-26",
        group: "II",
        paperCode: "5014",
        time: "20 Minutes",
        marks: "19"
    },
    sections: [
        {
            id: 1,
            instruction: "Choose the correct form of verb and fill up the bubbles sheet :",
            questions: [
                {
                    id: '1-1',
                    text: "$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$ What is the value of $x$ in the equation:",
                    formula: "2x + 5 = 15",
                    options: ["$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$", "$x = 10$", "$x = 7$", "$x = 2$"]
                },
                { id: '2', text: "I had --- the house before it started raining.", options: ["$e^{ix} = \\cos(x) + i\\sin(x)$", "leave", "leaving", "will leave"] },
                { id: '3', text: "Good students always --- hard.", options: ["worked", "will work", "work", "works"] },
                { id: '4', text: "The sun --- in the west.", options: ["sets", "will set", "set", "has set"] },
                { id: '5', text: "She --- playing the piano since 2 o' clock.", options: ["is", "was", "has been", "have been"] }
            ]
        },
        {
            id: 2,
            instruction: "Choose the word with correct spelling and fill up the bubbles sheet :",
            questions: [
                { id: '6', options: ["Medya", "Media", "Madya", "Medaia"] },
                { id: '7', options: ["Vanture", "Vunture", "Venture", "Veneture"] },
                { id: '8', options: ["Hestory", "Hestorey", "History", "Historey"] },
                { id: '9', options: ["Sterleng", "Stirling", "Sturling", "Sterling"] }
            ]
        },
        {
            id: 3,
            instruction: "Choose the correct meaning of the underlined word and fill up the bubbles sheet :",
            questions: [
                { id: '1-10', text: "The word pivot means :", options: ["exterior", "central point", "edge", "maintain"] },
                { id: '11', text: "The word enormity means :", options: ["importance", "vastness", "enormousness", "difficulty"] },
                { id: '12', text: "Astonish means :", options: ["make", "mix", "separate", "surprise"] },
                { id: '13', text: "The word Pagan means :", options: ["honest", "hard", "clear", "disbeliever"] },
                { id: '14', text: "The little birds are piping yet. The underlined word is a synonym of :", options: ["twittering", "crying", "weeping", "yelling"] }
            ]
        },
        {
            id: 4,
            instruction: "Choose the correct option according to the grammar and fill up the bubbles sheet :",
            questions: [
                { id: '15', text: "The boy laughs loudly. The underlined word is a / an :", options: ["intransitive verb", "model verb", "transitive verb", "irregular verb"] },
                { id: '16', text: "This is the girl --- stood first in the class.", options: ["which", "whose", "who", "whom"] },
                { id: '17', text: "Which of the following is a phrase :", options: ["It is of no use", "He is well", "In an unwise manner", "Over there hangs the bell"] },
                { id: '18', text: "Who is --- for this chaos?", options: ["responding", "responsible", "responsive", "responded"] },
                { id: '19', text: "We watched him go. The underlined word is a / an :", options: ["past participle", "gerund", "present participle", "infinitive"] }
            ]
        }
    ]
};

const OptionLabels = ['A', 'B', 'C', 'D'];

const SmartText = ({ content }) => {
    if (typeof content !== 'string') return content;

    // Check if the string is wrapped in $...$
    const isMath = content.startsWith('$') && content.endsWith('$');

    if (isMath) {
        // Strip the first and last characters ($)
        const rawMath = content.slice(1, -1);
        return <MathText math={rawMath} />;
    }

    return <span>{content}</span>;
};


const TemplatesPage = () => {
    const { metadata, sections } = paperData;

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white text-black font-serif border border-gray-400 my-10 shadow-lg overflow-auto">

            {/* HEADER */}
            <div className="flex justify-between items-start mb-6 text-sm">
                <div className="w-1/3">
                    <p>Roll No __________</p>
                    <p className="font-bold mt-4 text-base">{metadata.title}</p>
                    <p>Q. PAPER - I (Objective Type)</p>
                </div>
                <div className="w-1/3 text-center">
                    <p className="italic text-xs">(To be filled in by the candidate)</p>
                    <p className="font-bold mt-1 uppercase">{metadata.exam}</p>
                    <p className="font-bold text-xl mt-1">GROUP — {metadata.group}</p>
                    <p className="font-bold border-2 border-black inline-block px-4 py-1 mt-2">
                        PAPER CODE = {metadata.paperCode}
                    </p>
                </div>
                <div className="w-1/3 text-right">
                    <p className="font-bold text-xs mb-4">Academic Sessions {metadata.session}</p>
                    <p>Time Allowed : {metadata.time}</p>
                    <p>Maximum Marks : {metadata.marks}</p>
                </div>
            </div>

            {/* NOTE */}
            <div className="text-[11px] mb-6 border-b-2 border-black pb-2 leading-tight">
                <p><span className="font-bold">Note:</span> Four possible answers A, B, C and D to each question are given. The choice which you think is correct, fill that circle in front of that question with Marker or Pen ink in the answer-book. Cutting or filling two or more circles will result in zero mark in that question.</p>
            </div>

            {/* DYNAMIC SECTIONS */}
            {sections.map((section, sIndex) => (
                <div key={section.id} className="mb-8">
                    <h3 className="font-bold text-sm mb-3">
                        {section.instruction}
                    </h3>

                    <table className="w-full border-collapse border border-black">
                        <tbody>
                            {section.questions.map((q) => (
                                <tr key={q.id} className="border border-black">
                                    {/* Question Number Column */}
                                    <td className="border border-black p-2 w-14 text-center font-bold text-sm">
                                        {q.id}
                                    </td>

                                    {/* Question Content Column */}
                                    <td className="p-2">
                                        <div className="mb-2">
                                            <SmartText content={q.text} />
                                            {q.formula && <div className="my-2"><BlockMath math={q.formula} /></div>}
                                        </div>
                                        <div className="grid grid-cols-4 gap-1 text-xs sm:text-sm">
                                            {q.options.map((opt, i) => (
                                                <div key={i} className="flex items-center gap-1">
                                                    <span className="font-bold">({String.fromCharCode(65 + i)})</span>
                                                    <SmartText content={opt} />
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Page break marker for the middle of the paper (matching your image) */}
                    {sIndex === 1 && <div className="text-center font-bold my-4 text-sm">(2)</div>}
                </div>
            ))}

            {/* FOOTER */}
            <div className="flex justify-between items-center mt-6 text-[10px] font-mono border-t border-gray-200 pt-2">
                <p>105-024-II-(Objective Type)- 45500 ( {metadata.paperCode} )</p>
                <p className="font-bold text-xs uppercase">(Turn Over)</p>
            </div>
        </div>
    );
};

export default TemplatesPage;