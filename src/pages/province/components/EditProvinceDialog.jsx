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
import { useUpdateProvince } from "../../../hooks/useFetchProvince";

const EditProvinceDialog = ({ data, openProvince, setOpenProvince }) => {

    const [name, setName] = useState(data.name);

    const { mutate: updateProvinceMutate, isPending, isError, error } = useUpdateProvince();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (name === data.name) {
            toast.error(`No changes made to the province name.`);
            return;
        }

        updateProvinceMutate(
            {
                id: data?.id,
                name,
            },
            {
                onSuccess: () => {
                    setOpenProvince(false);
                },
            }
        );
    };

    return (
        <Dialog open={openProvince} onOpenChange={setOpenProvince}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Edit Province</DialogTitle>
                    <DialogDescription>
                        Update the province name and click save.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="provinceName">Province Name</Label>
                        <Input
                            id="provinceName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Sindh"
                            disabled={isPending}
                            autoFocus
                        />
                    </div>

                    {isError ? (
                        <p className="text-sm text-destructive">
                            {error?.response?.data?.message ||
                                error?.message ||
                                "Failed to update province."}
                        </p>
                    ) : null}

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

export default EditProvinceDialog;
