"use client"

import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


export function DateRangePicker({
    value,
    onChange,
    placeholder = "Pick a date range",
    disabled = false,
    minDate,
    maxDate,
    className,
}) {
    const [open, setOpen] = useState(false)

    const displayValue =
        value?.from && value?.to
            ? `${format(value.from, "LLL dd, yyyy")} - ${format(value.to, "LLL dd, yyyy")}`
            : placeholder

    return (
        <div className={`flex flex-col gap-3 ${className ?? ""}`}>
            {/* {label && <Label className="px-1">{label}</Label>} */}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        disabled={disabled}
                        className="w-64 justify-between font-normal"
                    >
                        <span>{displayValue}</span>
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="range"
                        selected={value}
                        onSelect={(range) => onChange?.(range)}
                        fromDate={minDate}
                        toDate={maxDate}
                        captionLayout="dropdown"
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
