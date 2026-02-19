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

import { useUpdateBook } from "../../../hooks/useFetchBook"; // ✅ updated hook
import { AsyncSearchBox } from "../../../components/shared/AsyncSearchBox";
import { useGetAllSubjects } from "../../../hooks/useFetchSubject";
import { useGetAllClasses } from "../../../hooks/useFetchClass";
import { useGetAllPublishers } from "../../../hooks/useFetchPublisher";



const EditBookDialog = ({ data, openBook, setOpenBook }) => {
    const [name, setName] = useState("");
    const [subjectId, setSubjectId] = useState("");
    const [classId, setClassId] = useState("");
    const [publisherId, setPublisherId] = useState("");

    const { mutate: updateBookMutate, isLoading, isError, error } =
        useUpdateBook();

    // Prefill form when dialog opens
    useEffect(() => {
        if (data) {
            setName(data.name || "");
            setSubjectId(data.subjectId || "");
            setClassId(data.classId || "");
            setPublisherId(data.publisherId || "");
        }
    }, [data]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim() || !subjectId || !classId || !publisherId) {
            toast.error("All fields are required.");
            return;
        }

        updateBookMutate(
            {
                id: data.id,
                name,
                subjectId: Number(subjectId),
                classId: Number(classId),
                publisherId: Number(publisherId),
            },
            {
                onSuccess: () => {
                    toast.success("Book updated successfully!");
                    setOpenBook(false);
                },
            }
        );
    };

    return (
        <Dialog open={openBook} onOpenChange={setOpenBook}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Update Book</DialogTitle>
                    <DialogDescription>
                        Edit book details and click save.
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
                            disabled={isLoading}
                            autoFocus
                        />
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                        <Label htmlFor="subjectId">Select Subject</Label>
                        <AsyncSearchBox
                            placeholder="Select Subject"
                            setItemId={setSubjectId}
                            useSearchHook={(search) =>
                                useGetAllSubjects({ search, enable: false })
                            }
                            initialValue={data.subject?.name}
                        />
                    </div>

                    {/* Class */}
                    <div className="space-y-2">
                        <Label htmlFor="classId">Select Class</Label>
                        <AsyncSearchBox
                            placeholder="Select Class"
                            setItemId={setClassId}
                            useSearchHook={(search) =>
                                useGetAllClasses({ search, enable: false })
                            }
                            initialValue={data.class?.name}
                        />
                    </div>

                    {/* Publisher */}
                    <div className="space-y-2">
                        <Label htmlFor="publisherId">Select Publisher</Label>
                        <AsyncSearchBox
                            placeholder="Select Publisher"
                            setItemId={setPublisherId}
                            useSearchHook={(search) =>
                                useGetAllPublishers({ search, enable: false })
                            }
                            initialValue={data.publisher?.name}
                        />
                    </div>

                    {isError && (
                        <p className="text-sm text-destructive">
                            {error?.response?.data?.message ||
                                error?.message ||
                                "Failed to update book."}
                        </p>
                    )}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button
                            type="submit"
                            disabled={
                                isLoading ||
                                !name.trim() ||
                                !subjectId ||
                                !classId ||
                                !publisherId
                            }
                        >
                            {isLoading ? "Updating..." : "Update"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditBookDialog;
