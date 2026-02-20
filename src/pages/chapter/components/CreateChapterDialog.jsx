import { useState } from "react";

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
import { Plus } from "lucide-react";

import { useCreateChapter } from "../../../hooks/useFetchChapter"; // ✅ changed
import { AsyncSearchBox } from "../../../components/shared/AsyncSearchBox";
import { useGetAllBooks } from "../../../hooks/useFetchBook"; // ✅ for selecting book

const CreateChapterDialog = () => {
    const [openChapter, setOpenChapter] = useState(false);
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [bookId, setBookId] = useState("");

    const { mutate: createChapterMutate, isPending, isError, error } =
        useCreateChapter();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim() || !number || !bookId) {
            toast.error("All fields are required.");
            return;
        }

        createChapterMutate(
            {
                name,
                number: Number(number),
                bookId: Number(bookId),
            },
            {
                onSuccess: () => {
                    toast.success("Chapter created successfully!");
                    setName("");
                    setNumber("");
                    setBookId("");
                    setOpenChapter(false);
                },
            }
        );
    };

    return (
        <Dialog open={openChapter} onOpenChange={setOpenChapter}>
            <DialogTrigger asChild>
                <Button className="self-end">
                    <Plus /> Create Chapter
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Create Chapter</DialogTitle>
                    <DialogDescription>
                        Enter chapter details and click save.
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
                            placeholder="e.g. Algebra Basics"
                            disabled={isPending}
                            autoFocus
                        />
                    </div>

                    {/* Chapter Number */}
                    <div className="space-y-2">
                        <Label htmlFor="chapterNumber">Chapter Number</Label>
                        <Input
                            id="chapterNumber"
                            type="number"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            placeholder="e.g. 1"
                            disabled={isPending}
                        />
                    </div>

                    {/* Select Book */}
                    <div className="space-y-2">
                        <Label>Select Book</Label>
                        <AsyncSearchBox
                            placeholder="Select Book"
                            setItemId={setBookId}
                            useSearchHook={(search) =>
                                useGetAllBooks({
                                    search,
                                    enable: false,
                                })
                            }
                        />
                    </div>

                    {isError && (
                        <p className="text-sm text-destructive">
                            {error?.response?.data?.message ||
                                error?.message ||
                                "Failed to create chapter."}
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
                            {isPending ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateChapterDialog;