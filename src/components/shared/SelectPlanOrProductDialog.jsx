import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, SearchX } from "lucide-react";
import { useState } from "react";

const SelectPlanOrProductDialog = ({
    actionFunction,
    data,
    recommendationIds,
    setRecommendationIds,
    buttonText,
    title,
    description,
    setServerSearch,
    serverSearch
}) => {
    const [search, setSearch] = useState("");

    // 1️⃣ Call API when dialog opens
    const handleOpenChange = (open) => {
        if (open && !data) {
            actionFunction();
        }
    };

    // 2️⃣ Toggle logic
    const toggleCheckbox = (id) => {
        setRecommendationIds((prev) => prev.includes(id)
            ? prev.filter((itemId) => itemId !== id) // uncheck
            : [...prev, id] // check
        );
    };


    const handleSearch = () => {
        setServerSearch(search)
    }

    return (
        <Dialog onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline"><Plus /> {buttonText || "Open dialog"}</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] min-h-0 max-h-[100vh] overflow-auto ">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex gap-2" >
                    <Input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button onClick={handleSearch} >
                        Search
                    </Button>
                    <Button size="icon" variant="outline" onClick={() => setServerSearch("")} >
                        <SearchX className="text-red-400" />
                    </Button>
                </div>

                <div className="grid gap-3">
                    {data?.length ? (
                        data.map((item) => (
                            <label
                                key={item.id}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="checkbox"
                                    checked={recommendationIds.includes(item.id)}
                                    onChange={() => toggleCheckbox(item.id)} />
                                <span>{item.name}</span>
                            </label>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No results found
                        </p>
                    )}
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Done</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


export default SelectPlanOrProductDialog;