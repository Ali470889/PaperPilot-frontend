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
import { useCreatePublisher } from "../../../hooks/useFetchPublisher"; // updated hook
import { Plus } from "lucide-react";

const CreatePublisherDialog = () => {
    const [openPublisher, setOpenPublisher] = useState(false);
    const [name, setName] = useState("");

    const { mutate: createPublisherMutate, isPending, isError, error } = useCreatePublisher();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Publisher name is required.");
            return;
        }

        createPublisherMutate(
            { name },
            {
                onSuccess: () => {
                    toast.success("Publisher created successfully!");
                    setName("");
                    setOpenPublisher(false);
                },
            }
        );
    };

    return (
        <Dialog open={openPublisher} onOpenChange={setOpenPublisher}>
            {/* DialogTrigger button */}
            <DialogTrigger asChild>
                <Button className="self-end">
                    <Plus /> Create Publisher
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Create Publisher</DialogTitle>
                    <DialogDescription>
                        Enter the publisher name and click save.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="publisherName">Publisher Name</Label>
                        <Input
                            id="publisherName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Punjab Textbook Board"
                            disabled={isPending}
                            autoFocus
                        />
                    </div>

                    {isError && (
                        <p className="text-sm text-destructive">
                            {error?.response?.data?.message || error?.message || "Failed to create publisher."}
                        </p>
                    )}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isPending}>
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button type="submit" disabled={isPending || !name.trim()}>
                            {isPending ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreatePublisherDialog;
