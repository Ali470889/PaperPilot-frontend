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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useUpdatePublisher } from "../../../hooks/useFetchPublisher";

const EditPublisherDialog = ({ data, openPublisher, setOpenPublisher }) => {
    const [name, setName] = useState(data.name);

    const { mutate: updatePublisherMutate, isPending, isError, error } = useUpdatePublisher();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (name === data.name) {
            toast.error("No changes made to the publisher name.");
            return;
        }

        updatePublisherMutate(
            {
                id: data?.id,
                name,
            },
            {
                onSuccess: () => {
                    toast.success("Publisher updated successfully!");
                    setOpenPublisher(false);
                },
            }
        );
    };

    return (
        <Dialog open={openPublisher} onOpenChange={setOpenPublisher}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Edit Publisher</DialogTitle>
                    <DialogDescription>
                        Update the publisher name and click save.
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
                            {error?.response?.data?.message ||
                                error?.message ||
                                "Failed to update publisher."}
                        </p>
                    )}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isPending}>
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button type="submit" disabled={isPending || !name.trim()}>
                            {isPending ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditPublisherDialog;
