import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StateDisplay } from "@/components/shared/StateDisplay";
import Pagination from "@/components/shared/Pagination";
import { Plus, Pencil, Trash2, SearchX } from "lucide-react";
import { useGetSections, useDeleteSection } from "@/hooks/useFetchSection";
import { toast } from "sonner";

const SectionList = ({ onCreateNew, onEdit }) => {
    const [inputValue, setInputValue] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const size = 10;

    const { data, isLoading, isError, refetch } = useGetSections({
        page,
        size,
        search,
    });

    const deleteMutation = useDeleteSection();

    const sections = data?.data || data?.sections || data?.items || [];
    const totalPages = data?.totalPages || data?.meta?.totalPages || 1;

    const handleSearch = () => {
        setPage(1);
        setSearch(inputValue.trim());
    };

    const handleClear = () => {
        setInputValue("");
        setSearch("");
        setPage(1);
    };

    const handleDelete = (id, name) => {
        if (!window.confirm(`Delete section "${name}"? This cannot be undone.`)) return;
        deleteMutation.mutate(id, {
            onSuccess: () => toast.success(`Section "${name}" deleted`),
            onError: () => toast.error("Failed to delete section"),
        });
    };

    return (
        <Card className="h-full w-full overflow-hidden rounded-none border-0 flex flex-col">
            <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                    <CardTitle>Sections</CardTitle>
                    <Button size="sm" className="gap-1" onClick={onCreateNew}>
                        <Plus className="h-4 w-4" />
                        New
                    </Button>
                </div>

                <div className="flex gap-2">
                    <Input
                        placeholder="Search..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearch();
                        }}
                        className="h-8 text-sm"
                    />
                    <Button size="sm" variant="outline" onClick={handleSearch} className="h-8">
                        Search
                    </Button>
                    {search && (
                        <Button size="sm" variant="outline" onClick={handleClear} className="h-8">
                            <SearchX className="h-3 w-3 text-destructive" />
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden">
                {isLoading && (
                    <StateDisplay
                        state="loading"
                        title="Loading..."
                        message="Fetching sections"
                    />
                )}

                {isError && (
                    <StateDisplay
                        state="error"
                        title="Error"
                        message="Failed to load sections"
                        onRetry={refetch}
                    />
                )}

                {!isLoading && !isError && sections.length === 0 && (
                    <StateDisplay
                        state="not-found"
                        title="No Sections"
                        message="Create your first section to get started."
                    />
                )}

                {!isLoading && !isError && sections.length > 0 && (
                    <ScrollArea className="h-full pr-2">
                        <div className="space-y-2">
                            {sections.map((section) => (
                                <div
                                    key={section.id}
                                    className="flex items-center justify-between rounded-md border p-3 hover:bg-accent/50 transition-colors"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium truncate">
                                            {section.name}
                                        </p>
                                        {section.questionType && (
                                            <p className="text-xs text-muted-foreground">
                                                {section.questionType.name || section.questionType}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => onEdit(section)}
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() =>
                                                handleDelete(section.id, section.name)
                                            }
                                            disabled={deleteMutation.isPending}
                                        >
                                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>

            {!isLoading && !isError && sections.length > 0 && (
                <div className="px-4 pb-3">
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        isLoading={isLoading}
                    />
                </div>
            )}
        </Card>
    );
};

export default SectionList;
