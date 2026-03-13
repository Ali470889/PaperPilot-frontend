import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { SearchX } from "lucide-react";
import { ErrorState } from "../../components/shared/ErrorState";
import { LoadingState } from "../../components/shared/LoadingState";

import { useGetAllBoards } from "../../hooks/useFetchBoard";
import { BoardDataTable } from "./components/BoardDataTable";
import CreateBoardDialog from "./components/CreateBoardDialog";

const BoardPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState(null);

  const { data, isLoading, refetch, isError } = useGetAllBoards({
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
    <>
      <CreateBoardDialog />
      {/* Search Section */}
      <div className="flex flex-col md:flex-row gap-3">
        <Input
          placeholder="Search board..."
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
      {isLoading && <LoadingState name={"boards"} />}

      {/* Error */}
      {isError && (
        <ErrorState onRetry={refetch} message={"Failed to fetch boards"} />
      )}

      {/* Table */}
      {!isLoading && <BoardDataTable data={data?.boards} />}
    </>
  );
};

export default BoardPage;
