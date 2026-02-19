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

import { useCreateBook } from "../../../hooks/useFetchBook"; // ✅ updated hook
import { AsyncSearchBox } from "../../../components/shared/AsyncSearchBox";
import { useGetAllSubjects } from "../../../hooks/useFetchSubject";
import { useGetAllClasses } from "../../../hooks/useFetchClass";
import { useGetAllPublishers } from "../../../hooks/useFetchPublisher";



const CreateBookDialog = () => {
    const [openBook, setOpenBook] = useState(false);
    const [name, setName] = useState("");
    const [subjectId, setSubjectId] = useState("");
    const [classId, setClassId] = useState("");
    const [publisherId, setPublisherId] = useState("");

    // const [value, setValue] = useState("");
    const [itemId, setItemId] = useState(null);


    // const { data, isLoading, refetch, isError: isErrorSubject } = useGetAllSubjects();


    const { mutate: createBookMutate, isPending, isError, error } =
        useCreateBook();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim() || !subjectId || !classId || !publisherId) {
            toast.error("All fields are required.");
            return;
        }

        createBookMutate(
            {
                name,
                subjectId: Number(subjectId),
                classId: Number(classId),
                publisherId: Number(publisherId),
            },
            {
                onSuccess: () => {
                    toast.success("Book created successfully!");
                    setName("");
                    setSubjectId("");
                    setClassId("");
                    setPublisherId("");
                    setOpenBook(false);
                },
            }
        );
    };

    return (
        <Dialog open={openBook} onOpenChange={setOpenBook}>
            <DialogTrigger asChild>
                <Button className="self-end">
                    <Plus /> Create Book
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Create Book</DialogTitle>
                    <DialogDescription>
                        Enter book details and click save.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Book Name */}
                    <div className="space-y-2">
                        <Label htmlFor="bookName">Book Name</Label>
                        <Input
                            id="bookName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Physics 9th PTB"
                            disabled={isPending}
                            autoFocus
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="classId">Select Subject</Label>
                        <AsyncSearchBox
                            placeholder="Select Subject"
                            setItemId={setSubjectId}
                            useSearchHook={(search) => useGetAllSubjects({ search, enable: false })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="classId">Select Class</Label>
                        <AsyncSearchBox
                            placeholder="Select Class"
                            setItemId={setClassId}
                            useSearchHook={(search) => useGetAllClasses({ search, enable: false })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="classId">Select Publisher</Label>
                        <AsyncSearchBox
                            placeholder="Select Publisher"
                            setItemId={setPublisherId}
                            useSearchHook={(search) => useGetAllPublishers({ search, enable: false })}
                        />

                    </div>




                    {isError && (
                        <p className="text-sm text-destructive">
                            {error?.response?.data?.message ||
                                error?.message ||
                                "Failed to create book."}
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
                                !subjectId ||
                                !classId ||
                                !publisherId
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

export default CreateBookDialog;
