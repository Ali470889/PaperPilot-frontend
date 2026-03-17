import { useEffect, useState } from "react";

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
import { useUpdateQuestionType } from "../../../hooks/useFetchQuestionType";

const EditQuestionTypeDialog = ({ data, openQuestionType, setOpenQuestionType }) => {
  const [name, setName] = useState(data?.name || "");

  useEffect(() => {
    setName(data?.name || "");
  }, [data]);

  const {
    mutate: updateQuestionTypeMutate,
    isPending,
    isError,
    error,
  } = useUpdateQuestionType();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Question type name is required.");
      return;
    }

    if (name.trim() === data?.name) {
      toast.error("No changes made to the question type name.");
      return;
    }

    updateQuestionTypeMutate(
      {
        id: data?.id,
        name: name.trim(),
      },
      {
        onSuccess: () => {
          setOpenQuestionType(false);
        },
      }
    );
  };

  return (
    <Dialog open={openQuestionType} onOpenChange={setOpenQuestionType}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Question Type</DialogTitle>
          <DialogDescription>
            Update the question type name and click save.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="questionTypeName">Question Type Name</Label>
            <Input
              id="questionTypeName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. MCQs"
              disabled={isPending}
              autoFocus
            />
          </div>

          {isError ? (
            <p className="text-sm text-destructive">
              {error?.response?.data?.message ||
                error?.message ||
                "Failed to update question type."}
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

export default EditQuestionTypeDialog;
