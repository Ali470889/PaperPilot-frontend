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
import { useUpdateClass } from "../../../hooks/useFetchClass";

const EditClassDialog = ({ data, openClass, setOpenClass }) => {

    const [name, setName] = useState("");

    // Populate form when dialog opens
    useEffect(() => {
        if (data) {
            setName(data.name || "");
        }
    }, [data]);

    const { mutate: updateClassMutate, isPending } = useUpdateClass();

    const handleSubmit = () => {
        if (!name.trim()) {
            toast.error("Class name is required");
            return;
        }

        updateClassMutate(
            {
                id: data?.id,
                name: name.trim(),
            },
            {
                onSuccess: () => {
                    toast.success("Class updated successfully");
                    setOpenClass(false);
                },
                onError: (error) => {
                    toast.error(error?.response?.data?.message || "Update failed");
                },
            }
        );
    };

    return (
        <Dialog open={openClass} onOpenChange={setOpenClass}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Class</DialogTitle>
                    <DialogDescription>
                        Update the class name and click save.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
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
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditClassDialog;
