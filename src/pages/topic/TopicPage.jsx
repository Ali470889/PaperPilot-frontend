import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { SearchX } from "lucide-react";
import { ErrorState } from "../../components/shared/ErrorState";
import { LoadingState } from "../../components/shared/LoadingState";

import { useGetAllTopics } from "../../hooks/useFetchTopic";
import { TopicDataTable } from "./components/TopicDataTable";
import CreateTopicDialog from "./components/CreateTopicDialog";

const TopicPage = () => {
    const [inputValue, setInputValue] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [size] = useState(10);

    const { data, isLoading, isError, refetch } = useGetAllTopics({
        page,
        size,
        search,
    });

    const handleSearch = () => {
        setSearch(inputValue.trim());
        setPage(1);
    };

    const handleClear = () => {
        setInputValue("");
        setSearch("");
        setPage(1);
    };

    const totalPages = data?.totalPages || 1;

    return (
        <>
            <CreateTopicDialog />

            <div className="flex flex-col md:flex-row gap-3 my-4">
                <Input
                    placeholder="Search topics..."
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

            {isLoading && <LoadingState name="topics" />}

            {isError && (
                <ErrorState
                    onRetry={refetch}
                    message="Failed to fetch topics"
                />
            )}

            {!isLoading && !isError && (
                <>
                    <TopicDataTable
                        data={data?.items || []}
                        page={page}
                        size={size}
                    />

                    <div className="flex justify-between items-center mt-4">
                        <Button
                            variant="outline"
                            disabled={page === 1}
                            onClick={() => setPage((prev) => prev - 1)}
                        >
                            Previous
                        </Button>

                        <span className="text-sm">
                            Page {page} of {totalPages}
                        </span>

                        <Button
                            variant="outline"
                            disabled={page === totalPages}
                            onClick={() => setPage((prev) => prev + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </>
            )}
        </>
    );
};

export default TopicPage;
