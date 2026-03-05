import { Button } from "@/components/ui/button";


export default function Card({
    name,
    description,
    primaryActionText,
    secondaryActionText,
    onPrimaryClick,
    onSecondaryClick,
}) {
    return (
        <div className=" flex flex-col justify-between gap-2 p-4 w-full max-w-sm shadow-md border rounded-2xl">
            <div>
                <div className="text-xl font-semibold">
                    {name}
                </div>
                <div>
                    {description}
                </div>
            </div>

            <div>
                {/* You can add extra content here later if needed */}
            </div>

            <div className="flex justify-between gap-2">
                {secondaryActionText && <Button
                    variant="outline"
                    className="w-full"
                    onClick={onSecondaryClick}
                >
                    {secondaryActionText}
                </Button>}

                {primaryActionText && <Button
                    className="w-full"
                    onClick={onPrimaryClick}
                >
                    {primaryActionText}
                </Button>}
            </div>
        </div>
    )
}