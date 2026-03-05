import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { SearchX } from 'lucide-react';
import { useState } from 'react';
import Card from "../../../components/shared/Card";
import { useGetAllPublishers } from "../../../hooks/useFetchPublisher";

const SelectPublisher = () => {

    const [inputValue, setInputValue] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [size] = useState(10);


    const { data, isLoading, refetch, isError } = useGetAllPublishers({
        page,
        size,
        search,
    });

    console.log("data", data);


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
            <Progress value={33} />

            <div className="flex flex-col md:flex-row gap-3">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data?.items?.map((item) => (
                    <Card
                        key={item.id}
                        name={item.name}
                        primaryActionText="Select"
                        onPrimaryClick={() => alert("Primary Clicked")}
                    />
                ))}
            </div>
        </>
    )
}

export default SelectPublisher
