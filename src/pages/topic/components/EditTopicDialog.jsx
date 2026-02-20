import { useState, useEffect } from "react";

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
import { Edit } from "lucide-react";

import { useUpdateTopic } from "../../../hooks/useFetchTopic";
import { AsyncSearchBox } from "../../../components/shared/AsyncSearchBox";
import { useGetAllChapters } from "../../../hooks/useFetchChapter";

const EditTopicDialog = ({ data, openTopic, setOpenTopic }) => {
    const [name, setName] = useState("");
    const [chapterId, setChapterId] = useState("");

    const { mutate: updateTopicMutate, isPending, isError, error } =
        useUpdateTopic();

    useEffect(() => {
        if (data) {
            setName(data.name || "");
            setChapterId(data.chapterId || data.chapter?.id || "");
        }
    }, [data]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim() || !chapterId) {
            toast.error("All fields are required.");
            return;
        }

        updateTopicMutate(
            {
                id: data.id,
                name,
                chapterId: Number(chapterId),
            },
            {
                onSuccess: () => {
                    toast.success("Topic updated successfully!");
                    setOpenTopic(false);
                },
            }
        );
    };

    return (
        <Dialog open={openTopic} onOpenChange={setOpenTopic}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Update Topic</DialogTitle>
                    <DialogDescription>
                        Edit topic details and click save.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Topic Name */}
                    <div className="space-y-2">
                        <Label htmlFor="topicName">Topic Name</Label>
                        <Input
                            id="topicName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Introduction"
                            disabled={isPending}
                            autoFocus
                        />
                    </div>

                    {/* Chapter Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="chapterId">Select Chapter</Label>
                        <AsyncSearchBox
                            placeholder="Select Chapter"
                            setItemId={setChapterId}
                            useSearchHook={(search) =>
                                useGetAllChapters({ search, enable: false })
                            }
                            initialValue={data.chapter?.name}
                        />
                    </div>

                    {isError && (
                        <p className="text-sm text-destructive">
                            {error?.response?.data?.message ||
                                error?.message ||
                                "Failed to update topic."}
                        </p>
                    )}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button
                            type="submit"
                            disabled={
                                isPending ||
                                !name.trim() ||
                                !chapterId
                            }
                        >
                            {isPending ? "Updating..." : "Update"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditTopicDialog;
