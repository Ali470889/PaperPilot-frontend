
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"


const AuditLogsDialog = ({ actionFunction, data, buttonText }) => {

    const handleOpenChange = (open) => {
        if (open && !data) {
            actionFunction();
        }
    };

    return (
        <Dialog onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline">{buttonText || "Open dialog"}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you&apos;re
                        done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3">
                    {data?.data?.length ? (
                        data.data.map((item) => (
                            <div>
                                {item}
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No results found
                        </p>
                    )}
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}

export default AuditLogsDialog




