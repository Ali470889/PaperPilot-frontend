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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateBoard, useUpdateBoard } from "../../../hooks/useFetchBoard";
import { useGetAllProvinces } from "../../../hooks/useFetchProvince";

const EditBoardDialog = ({ data, openBoard, setOpenBoard }) => {

    const [form, setForm] = useState({
        name: data?.name || "",
        acronym: data?.acronym || "",
        provinceId: data.provinceId || "",
        city: data?.city || "",
        hasMetric: data?.hasMetric || true,
        hasInter: data?.hasInter || true,
    });




    const { mutate: updateBoardMutate, isPending } = useUpdateBoard();

    const {
        data: provinces,
        isLoading: isLoadingProvinces,
        isError: isErrorProvinces
    } = useGetAllProvinces({
        page: 1,
        size: 10,
        enable: openBoard,
    });

    const onChange = (key) => (e) => {
        setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

    const onCheck = (key) => (checked) => {
        setForm((prev) => ({ ...prev, [key]: !!checked }));
    };

    const handleSubmit = () => {
        updateBoardMutate({
            id: data?.id,
            name: form.name,
            acronym: form.acronym,
            provinceId: Number(form.provinceId),
            city: form.city,
            hasMetric: form.hasMetric,
            hasInter: form.hasInter,
        }, {
            onSuccess: () => {
                setOpenBoard(false);
                setForm({
                    name: "",
                    acronym: "",
                    provinceId: "",
                    city: "",
                    hasMetric: true,
                    hasInter: true,
                });
                toast.success("Board created successfully");
            }
        });
    };

    return (
        <Dialog open={openBoard} onOpenChange={setOpenBoard}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Education Board</DialogTitle>
                    <DialogDescription>
                        Update the details below and click save to update the board.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Board Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Lahore Board"
                            value={form.name}
                            onChange={onChange("name")}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="acronym">Acronym</Label>
                        <Input
                            id="acronym"
                            placeholder="e.g. BISE Lahore"
                            value={form.acronym}
                            onChange={onChange("acronym")}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Province</Label>

                        <Select
                            value={String(form.provinceId)}
                            onValueChange={(value) =>
                                setForm((prev) => ({ ...prev, provinceId: value }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a province" />
                            </SelectTrigger>

                            <SelectContent>
                                {isLoadingProvinces && (
                                    <SelectItem value="loading" disabled>
                                        Loading...
                                    </SelectItem>
                                )}

                                {isErrorProvinces && (
                                    <SelectItem value="error" disabled>
                                        Failed to load provinces
                                    </SelectItem>
                                )}

                                {provinces?.provinces?.map((province) => (
                                    <SelectItem
                                        key={province.id}
                                        value={String(province.id)}
                                    >
                                        {province.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>


                    <div className="grid gap-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                            id="city"
                            placeholder="e.g. Lahore"
                            value={form.city}
                            onChange={onChange("city")}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <Switch
                            id="hasMetric"
                            checked={form.hasMetric}
                            onCheckedChange={onCheck("hasMetric")}
                        />
                        <Label htmlFor="hasMetric" className="cursor-pointer">
                            Has Metric
                        </Label>
                    </div>

                    <div className="flex items-center gap-3">
                        <Switch
                            id="hasInter"
                            checked={form.hasInter}
                            onCheckedChange={onCheck("hasInter")}
                        />
                        <Label htmlFor="hasInter" className="cursor-pointer">
                            Has Inter
                        </Label>
                    </div>

                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isPending}>
                            Cancel
                        </Button>
                    </DialogClose>

                    <Button onClick={handleSubmit} disabled={isPending}>
                        {isPending ? "Saving..." : "Save changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditBoardDialog;
