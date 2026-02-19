import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { SearchX } from "lucide-react";
import { ErrorState } from "../../components/shared/ErrorState";
import { LoadingState } from "../../components/shared/LoadingState";

import { useGetAllPublishers } from "../../hooks/useFetchPublisher";
import { PublisherDataTable } from "./components/PublisherDataTable";
import CreatePublisherDialog from "./components/CreatePublisherDialog";

const PublisherPage = () => {
    const [inputValue, setInputValue] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [size] = useState(10);

    const { data, isLoading, refetch, isError } = useGetAllPublishers({
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

    return (
        <>
            {/* Create Publisher Dialog */}
            <CreatePublisherDialog />

            {/* Search Section */}
            <div className="flex flex-col md:flex-row gap-3 my-4">
                <Input
                    placeholder="Search publisher..."
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
            {isLoading && <LoadingState name={"publishers"} />}

            {/* Error State */}
            {isError && (
                <ErrorState
                    onRetry={refetch}
                    message={"Failed to fetch publishers"}
                />
            )}

            {/* Data Table */}
            {!isLoading && !isError && (
                <PublisherDataTable
                    data={data?.publishers}          // array of publishers
                />
            )}
        </>
    );
};

export default PublisherPage;
