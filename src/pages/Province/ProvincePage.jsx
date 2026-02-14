
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { SearchX } from "lucide-react";
import { ErrorState } from "../../components/shared/ErrorState";
import { LoadingState } from "../../components/shared/LoadingState";
import { useGetAllProvinces } from '../../hooks/useFetchProvince';
import { ProvinceDataTable } from "./components/ProvinceDataTable";

const ProvincePage = () => {
    const [inputValue, setInputValue] = useState("");
    const [search, setSearch] = useState(null);

    const { data, isLoading, refetch, isError } = useGetAllProvinces({
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


    return (
        <div className="p-6 space-y-6">
            {/* Search Section */}
            <div className="flex flex-col md:flex-row gap-3">
                <Input
                    placeholder="Search province..."
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
            {isLoading && (
                <LoadingState name={"provinces"} />
            )}

            {/* Error */}
            {isError && (
                <ErrorState
                    onRetry={refetch}
                    message={"Failed to fetch provinces"}
                />
            )}

            {/* Table */}
            {!isLoading && <ProvinceDataTable data={data?.provinces} />}

        </div>
    )
}

export default ProvincePage


