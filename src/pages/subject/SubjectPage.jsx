// import React from 'react'
// import CreateSubjectDialog from './components/CreateSubjectDialog'

// const SubjectPage = () => {
//     return (
//         <>
//             <CreateSubjectDialog />

//         </>
//     )
// }

// export default SubjectPage


import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { SearchX } from "lucide-react";
import { ErrorState } from "../../components/shared/ErrorState";
import { LoadingState } from "../../components/shared/LoadingState";

import { useGetAllSubjects } from "../../hooks/useFetchSubject";
import { SubjectDataTable } from "./components/SubjectDataTable";
import CreateSubjectDialog from "./components/CreateSubjectDialog";

const SubjectPage = () => {
    const [inputValue, setInputValue] = useState("");
    const [search, setSearch] = useState("");
    const [page] = useState(1);
    const [size] = useState(10);

    const { data, isLoading, refetch, isError } = useGetAllSubjects({
        page,
        size,
        search,
    });

    const handleSearch = () => {
        setSearch(inputValue.trim());
    };

    const handleClear = () => {
        setInputValue("");
        setSearch("");
    };

    return (
        <>
            <CreateSubjectDialog />

            {/* Search Section */}
            <div className="flex flex-col md:flex-row gap-3">
                <Input
                    placeholder="Search subject..."
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
            {isLoading && <LoadingState name={"subjects"} />}

            {/* Error */}
            {isError && (
                <ErrorState
                    onRetry={refetch}
                    message={"Failed to fetch subjects"}
                />
            )}

            {/* Table */}
            {!isLoading && !isError && (
                <SubjectDataTable
                    data={data?.subjects}
                    total={data?.total}
                    page={data?.page}
                    totalPages={data?.totalPages}
                />
            )}
        </>
    );
};

export default SubjectPage;
