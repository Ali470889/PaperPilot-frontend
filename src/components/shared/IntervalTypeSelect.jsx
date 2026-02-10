import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const intervalMapping = {
    days: "Days",
    weeks: "Weeks",
    months: "Months",
    years: "Years",
};

const IntervalTypeSelect = ({ intervalType, setIntervalType, className }) => {
    return (
        <Select value={intervalType || ""} onValueChange={setIntervalType}>
            <SelectTrigger className={className || "w-[200px]"}>
                <SelectValue placeholder="Interval Type" />
            </SelectTrigger>
            <SelectContent>
                {Object.entries(intervalMapping).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                        {label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default IntervalTypeSelect;
