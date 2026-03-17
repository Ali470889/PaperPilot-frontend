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
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useCreateQuestionType } from "../../../hooks/useFetchQuestionType";

const CreateQuestionTypeDialog = () => {
  const [openQuestionType, setOpenQuestionType] = useState(false);
  const [name, setName] = useState("");

  const {
    mutate: createQuestionTypeMutate,
    isPending,
    isError,
    error,
  } = useCreateQuestionType();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Question type name is required.");
      return;
    }

    createQuestionTypeMutate(
      { name: name.trim() },
      {
        onSuccess: () => {
          setName("");
          setOpenQuestionType(false);
        },
      }
    );
  };

  return (
    <Dialog open={openQuestionType} onOpenChange={setOpenQuestionType}>
      <DialogTrigger asChild>
        <Button className="self-end">
          <Plus /> Create Question Type
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Question Type</DialogTitle>
          <DialogDescription>
            Enter the question type name and click save.
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
                "Failed to create question type."}
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

export default CreateQuestionTypeDialog;
