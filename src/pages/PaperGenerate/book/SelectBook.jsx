import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useGetAllBooks } from '../../../hooks/useFetchBook';
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../../components/shared/Card";
import { StateDisplay } from "../../../components/shared/StateDisplay";
import { SearchX } from "lucide-react";
import { ADMIN_ROUTE_BUILDERS } from "../../../routes/ADMIN_ROUTES";

const SelectBook = () => {

    const { publisherId, classId, subjectId } = useParams();

    const navigate = useNavigate();

    const [inputValue, setInputValue] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [size] = useState(10);

    const { data, isLoading, refetch, isError } = useGetAllBooks({
        page,
        size,
        search,
        publisherId,
        classId,
        subjectId

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
            {isError && (
                <StateDisplay
                    state="error"
                    title="Connection Failed"
                    message="We couldn't reach the server. Check your internet."
                    onRetry={() => refetch()}
                />
            )}

            {/* Loading State */}
            {isLoading && (
                <StateDisplay
                    state="loading"
                    title="Loading..."
                    message="Fetching classes. Please wait."
                />
            )}
            {data?.items?.length === 0 && (
                <StateDisplay
                    state="not-found"
                    title="No Classes Found"
                    message="Try adjusting your search or check back later."
                />
            )}
            {/* Data Grid */}
            {!isLoading && !isError && data?.items?.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {data?.items?.map((item) => (
                        <Card
                            key={item.id}
                            name={item.name}
                            primaryActionText="Select"
                            onPrimaryClick={() =>
                                navigate(
                                    ADMIN_ROUTE_BUILDERS.selectDataByBookId(item.id)
                                )
                            }
                        />
                    ))}
                </div>
            )}

        </>
    )
}

export default SelectBook
