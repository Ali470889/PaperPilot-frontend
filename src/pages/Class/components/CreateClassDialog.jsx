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
import { useState } from "react";
import { toast } from "sonner";
import { useCreateClass } from "../../../hooks/useFetchClass";

const CreateClassDialog = () => {

    const [name, setName] = useState("");
    const [open, setOpen] = useState(false);

    const { mutate: createClassMutate, isPending } = useCreateClass();

    const handleSubmit = () => {
        if (!name.trim()) {
            toast.error("Class name is required");
            return;
        }

        createClassMutate(
            { name },
            {
                onSuccess: () => {
                    setOpen(false);
                    setName("");
                    toast.success("Class created successfully");
                },
                onError: (error) => {
                    toast.error(
                        error?.response?.data?.message || "Failed to create class"
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
                    Create Class
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Education Class</DialogTitle>
                    <DialogDescription>
                        Enter the class name and click save.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Class Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. 9th Class"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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

export default CreateClassDialog;
