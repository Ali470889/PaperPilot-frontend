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
import { useCreateProvince } from "../../../hooks/useFetchProvince";
import { Plus } from "lucide-react";

const CreateProvinceDialog = () => {

  const [openProvince, setOpenProvince] = useState(false);

  const [name, setName] = useState("");

  const { mutate: createProvinceMutate, isPending, isError, error } = useCreateProvince();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(`Province name is required.`);
      return;
    }

    createProvinceMutate(
      { name },
      {
        onSuccess: () => {
          setOpenProvince(false);
        },
      }
    );
  };

  return (
    <Dialog open={openProvince} onOpenChange={setOpenProvince}>
      {/* If you already open it from outside, you can remove DialogTrigger */}
      <DialogTrigger asChild>
        <Button className="self-end"> <Plus /> Create Province</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Province</DialogTitle>
          <DialogDescription>
            Enter the province name and click save.
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
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProvinceDialog;
