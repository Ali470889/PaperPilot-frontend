// 


import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { SearchX } from "lucide-react";
import { ErrorState } from "../../components/shared/ErrorState";
import { LoadingState } from "../../components/shared/LoadingState";

import { useGetAllClasses } from "../../hooks/useFetchClass";
import { ClassDataTable } from "./components/ClassDataTable";
import CreateClassDialog from "./components/CreateClassDialog";

const ClassPage = () => {
    const [inputValue, setInputValue] = useState("");
    const [search, setSearch] = useState(null);
    const [page] = useState(1);
    const [size] = useState(10);

    const { data, isLoading, refetch, isError } = useGetAllClasses({
        page,
        size,
        search,
    });

    const handleSearch = () => {
        setSearch(inputValue.trim() || null);
    };

    const handleClear = () => {
        setInputValue("");
        setSearch(null);
    };

    return (
        <>
            <CreateClassDialog />

            {/* Search Section */}
            <div className="flex flex-col md:flex-row gap-3">
                <Input
                    placeholder="Search class..."
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

            {/* Loading */}
            {isLoading && <LoadingState name={"classes"} />}

            {/* Error */}
            {isError && (
                <ErrorState onRetry={refetch} message={"Failed to fetch classes"} />
            )}

            {/* Table */}
            {!isLoading && !isError && (
                <ClassDataTable
                    data={data?.classes}
                    total={data?.total}
                    page={data?.page}
                    totalPages={data?.totalPages}
                />
            )}
        </>
    );
};

export default ClassPage;
