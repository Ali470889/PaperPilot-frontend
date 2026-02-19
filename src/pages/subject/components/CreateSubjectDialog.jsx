import { useState } from "react";
import { toast } from "sonner";
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
import { Plus } from "lucide-react";
import { useCreateSubject } from "../../../hooks/useFetchSubject";

const CreateSubjectDialog = () => {

    const [name, setName] = useState("");
    const [description, setDescription] = useState(""); // ✅ added
    const [open, setOpen] = useState(false);

    const { mutate: createSubjectMutate, isPending } = useCreateSubject();

    const handleSubmit = () => {
        if (!name.trim()) {
            toast.error("Subject name is required");
            return;
        }

        if (!description.trim()) {
            toast.error("Subject description is required");
            return;
        }

        createSubjectMutate(
            { name, description }, // ✅ send both fields
            {
                onSuccess: () => {
                    setOpen(false);
                    setName("");
                    setDescription("");
                    toast.success("Subject created successfully");
                },
                onError: (error) => {
                    toast.error(
                        error?.response?.data?.message || "Failed to create subject"
                    );
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="self-end">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Subject
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Subject</DialogTitle>
                    <DialogDescription>
                        Enter subject details and click save.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-2">

                    {/* Subject Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="name">Subject Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Mathematics"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Subject Description */}
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            placeholder="e.g. Basic math subject"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isPending}>
                            Cancel
                        </Button>
                    </DialogClose>

                    <Button onClick={handleSubmit} disabled={isPending}>
                        {isPending ? "Saving..." : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateSubjectDialog;
