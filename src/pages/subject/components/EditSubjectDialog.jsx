import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUpdateSubject } from "../../../hooks/useFetchSubject"; // your React Query hook

const EditSubjectDialog = ({ data, openSubject, setOpenSubject }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    // Populate form when dialog opens
    useEffect(() => {
        if (data) {
            setName(data.name || "");
            setDescription(data.description || "");
        }
    }, [data]);

    const { mutate: updateSubjectMutate, isLoading } = useUpdateSubject();

    const handleSubmit = () => {
        if (!name.trim()) {
            toast.error("Subject name is required");
            return;
        }

        updateSubjectMutate(
            {
                id: data?.id,
                name: name.trim(),
                description: description.trim(),
            },
            {
                onSuccess: () => {
                    toast.success("Subject updated successfully");
                    setOpenSubject(false);
                },
                onError: (error) => {
                    toast.error(error?.response?.data?.message || "Update failed");
                },
            }
        );
    };

    return (
        <Dialog open={openSubject} onOpenChange={setOpenSubject}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Subject</DialogTitle>
                    <DialogDescription>
                        Update the subject name and description, then click save.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Subject Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Physics"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            placeholder="Optional description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isLoading}>
                            Cancel
                        </Button>
                    </DialogClose>

                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditSubjectDialog;
