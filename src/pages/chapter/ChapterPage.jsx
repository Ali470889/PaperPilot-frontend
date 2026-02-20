import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { SearchX } from "lucide-react";
import { ErrorState } from "../../components/shared/ErrorState";
import { LoadingState } from "../../components/shared/LoadingState";

import { useGetAllChapters } from "../../hooks/useFetchChapter";
import { ChapterDataTable } from "./components/ChapterDataTable";
import CreateChapterDialog from "./components/CreateChapterDialog";

const ChapterPage = () => {
    const [inputValue, setInputValue] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [size] = useState(10);

    const { data, isLoading, isError, refetch } = useGetAllChapters({
        page,
        size,
        search,
    });

    const handleSearch = () => {
        setSearch(inputValue.trim());
        setPage(1); // reset to first page on new search
    };

    const handleClear = () => {
        setInputValue("");
        setSearch("");
        setPage(1);
    };

    const totalPages = data?.totalPages || 1;

    return (
        <>
            {/* Create Chapter Dialog */}
            <CreateChapterDialog />

            {/* Search Section */}
            <div className="flex flex-col md:flex-row gap-3 my-4">
                <Input
                    placeholder="Search chapters..."
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

            {/* Loading State */}
            {isLoading && <LoadingState name="chapters" />}

            {/* Error State */}
            {isError && (
                <ErrorState
                    onRetry={refetch}
                    message="Failed to fetch chapters"
                />
            )}

            {/* Data Table */}
            {!isLoading && !isError && (
                <>
                    <ChapterDataTable
                        data={data?.items || []}
                        page={page}
                        size={size}
                    />

                    {/* Pagination Controls */}
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

export default ChapterPage;