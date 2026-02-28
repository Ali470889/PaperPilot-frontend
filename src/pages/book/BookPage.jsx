// import React from 'react'
// import CreateBookDialog from './components/CreateBookDialog'

// const BookPage = () => {
//     return (
//         <>
//             <CreateBookDialog />
//         </>
//     )
// }

// export default BookPage


import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { SearchX } from "lucide-react";
import { ErrorState } from "../../components/shared/ErrorState";
import { LoadingState } from "../../components/shared/LoadingState";

import { useGetAllBooks } from "../../hooks/useFetchBook";
import { BookDataTable } from "./components/BookDataTable";
import CreateBookDialog from "./components/CreateBookDialog";

const BookPage = () => {
    const [inputValue, setInputValue] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [size] = useState(10);

    const { data, isLoading, refetch, isError } = useGetAllBooks({
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
            {/* Create Book Dialog */}
            <CreateBookDialog />

            {/* Search Section */}
            <div className="flex flex-col md:flex-row gap-3">
                <Input
                    placeholder="Search books..."
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
            {isLoading && <LoadingState name={"books"} />}

            {/* Error State */}
            {isError && (
                <ErrorState
                    onRetry={refetch}
                    message={"Failed to fetch books"}
                />
            )}

            {/* Data Table */}
            {!isLoading && !isError && (
                <BookDataTable
                    data={data?.items}   // array of books
                />
            )}
        </>
    );
};

export default BookPage;
