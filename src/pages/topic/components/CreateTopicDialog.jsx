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
import { Plus } from "lucide-react";

import { useCreateTopic } from "../../../hooks/useFetchTopic";
import { AsyncSearchBox } from "../../../components/shared/AsyncSearchBox";
import { useGetAllChapters } from "../../../hooks/useFetchChapter";

const CreateTopicDialog = () => {
    const [openTopic, setOpenTopic] = useState(false);
    const [name, setName] = useState("");
    const [chapterId, setChapterId] = useState("");

    const { mutate: createTopicMutate, isPending, isError, error } =
        useCreateTopic();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim() || !chapterId) {
            toast.error("All fields are required.");
            return;
        }

        createTopicMutate(
            {
                name,
                chapterId: Number(chapterId),
            },
            {
                onSuccess: () => {
                    toast.success("Topic created successfully!");
                    setName("");
                    setChapterId("");
                    setOpenTopic(false);
                },
            }
        );
    };

    return (
        <Dialog open={openTopic} onOpenChange={setOpenTopic}>
            <DialogTrigger asChild>
                <Button className="self-end">
                    <Plus /> Create Topic
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Create Topic</DialogTitle>
                    <DialogDescription>
                        Enter topic details and click save.
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
                            placeholder="e.g. Introduction to Fractions"
                            disabled={isPending}
                            autoFocus
                        />
                    </div>

                    {/* Select Chapter */}
                    <div className="space-y-2">
                        <Label>Select Chapter</Label>
                        <AsyncSearchBox
                            placeholder="Select Chapter"
                            setItemId={setChapterId}
                            useSearchHook={(search) =>
                                useGetAllChapters({
                                    search,
                                    enable: false,
                                })
                            }
                        />
                    </div>

                    {isError && (
                        <p className="text-sm text-destructive">
                            {error?.response?.data?.message ||
                                error?.message ||
                                "Failed to create topic."}
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
                            {isPending ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateTopicDialog;
