import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Edit } from "lucide-react";

import { useUpdateChapter } from "../../../hooks/useFetchChapter"; // ✅ updated hook
import { AsyncSearchBox } from "../../../components/shared/AsyncSearchBox";
import { useGetAllBooks } from "../../../hooks/useFetchBook";

const EditChapterDialog = ({ data, openChapter, setOpenChapter }) => {
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [bookId, setBookId] = useState("");

    const { mutate: updateChapterMutate, isPending, isError, error } =
        useUpdateChapter();

    // Prefill form when dialog opens
    useEffect(() => {
        if (data) {
            setName(data.name || "");
            setNumber(data.number || "");
            setBookId(data.bookId || "");
        }
    }, [data]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim() || !number || !bookId) {
            toast.error("All fields are required.");
            return;
        }

        updateChapterMutate(
            {
                id: data.id,
                name,
                number: Number(number),
                bookId: Number(bookId),
            },
            {
                onSuccess: () => {
                    toast.success("Chapter updated successfully!");
                    setOpenChapter(false);
                },
            }
        );
    };

    return (
        <Dialog open={openChapter} onOpenChange={setOpenChapter}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Update Chapter</DialogTitle>
                    <DialogDescription>
                        Edit chapter details and click save.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Chapter Name */}
                    <div className="space-y-2">
                        <Label htmlFor="chapterName">Chapter Name</Label>
                        <Input
                            id="chapterName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Algebra"
                            disabled={isPending}
                            autoFocus
                        />
                    </div>

                    {/* Chapter Number */}
                    <div className="space-y-2">
                        <Label htmlFor="chapterNumber">
                            Chapter Number
                        </Label>
                        <Input
                            id="chapterNumber"
                            type="number"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            placeholder="e.g. 1"
                            disabled={isPending}
                        />
                    </div>

                    {/* Book Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="bookId">Select Book</Label>
                        <AsyncSearchBox
                            placeholder="Select Book"
                            setItemId={setBookId}
                            useSearchHook={(search) =>
                                useGetAllBooks({ search, enable: false })
                            }
                            initialValue={data.book?.name}
                        />
                    </div>

                    {isError && (
                        <p className="text-sm text-destructive">
                            {error?.response?.data?.message ||
                                error?.message ||
                                "Failed to update chapter."}
                        </p>
                    )}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button
                            type="submit"
                            disabled={
                                isPending ||
                                !name.trim() ||
                                !number ||
                                !bookId
                            }
                        >
                            {isPending ? "Updating..." : "Update"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditChapterDialog;