// import { useParams } from 'react-router-dom';
// import { useGetClassesByPublisher } from '../../../hooks/useFetchClass';

// const SelectClass = () => {

//     const { publisherId } = useParams();


//     const { data, isLoading, error } = useGetClassesByPublisher({publisherId, search});

//     console.log("data", data);


//     return (
//         <div>

//             SelectClass
//         </div>
//     )
// }

// export default SelectClass



import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { SearchX } from "lucide-react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Card from "../../../components/shared/Card";
import { StateDisplay } from "../../../components/shared/StateDisplay";
import { useGetClassesByPublisher } from "../../../hooks/useFetchClass";
import { ADMIN_ROUTE_BUILDERS } from "../../../routes/ADMIN_ROUTES";

const SelectClass = () => {
    const { publisherId } = useParams();
    const navigate = useNavigate();



    const [inputValue, setInputValue] = useState("");
    const [search, setSearch] = useState("");

    const { data, isLoading, isError, refetch } = useGetClassesByPublisher({
        publisherId,
        search,
    });

    console.log("classes", data);

    const handleSearch = () => {
        setSearch(inputValue.trim());
    };

    const handleClear = () => {
        setInputValue("");
        setSearch("");
    };

    return (
        <>
            <Progress value={66} />

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

            {/* Error State */}
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
                                    ADMIN_ROUTE_BUILDERS.selectSubjectByClassId(item.id)
                                )
                            }
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default SelectClass;