import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { SearchX } from "lucide-react";
import { ErrorState } from "../../components/shared/ErrorState";
import { LoadingState } from "../../components/shared/LoadingState";
import { useGetQuestionTypes } from "../../hooks/useFetchQuestionType";
import CreateQuestionTypeDialog from "./components/CreateQuestionTypeDialog";
import { QuestionTypeDataTable } from "./components/QuestionTypeDataTable";

const QuestionTypePage = () => {
    const [inputValue, setInputValue] = useState("");
    const [search, setSearch] = useState(null);

    const { data, isLoading, refetch, isError } = useGetQuestionTypes({
        page: 1,
        size: 10,
        search,
    });

    const handleSearch = () => {
        setSearch(inputValue.trim() || null);
    };

    const handleClear = () => {
        setInputValue("");
        setSearch(null);
    };

    const questionTypes = data?.questionTypes || data?.items || [];

    return (
        <>
            <CreateQuestionTypeDialog />

            <div className="flex flex-col md:flex-row gap-3">
                <Input
                    placeholder="Search question type..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                    }}
                />

                <Button onClick={handleSearch}>Search</Button>

                <Button variant="outline" onClick={handleClear}>
                    <SearchX className="text-destructive" />
                </Button>
            </div>

            {isLoading && <LoadingState name={"question types"} />}

            {isError && (
                <ErrorState
                    onRetry={refetch}
                    message={"Failed to fetch question types"}
                />
            )}

            {!isLoading && !isError && <QuestionTypeDataTable data={questionTypes} />}
        </>
    );
};

export default QuestionTypePage;
