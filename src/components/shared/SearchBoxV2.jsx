// import { Button } from "@/components/ui/button";
// import {
//     Command,
//     CommandEmpty,
//     CommandGroup,
//     CommandInput,
//     CommandItem,
//     CommandList,
// } from "@/components/ui/command";
// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger,
// } from "@/components/ui/popover";
// import { ChevronsUpDown, FileArchive, Search, SearchX } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { useState, useRef, useEffect } from "react";

// export function SearchBoxV2({
//     data,
//     setItemId,
//     disabled = false,
//     value,
//     setValue,

//     placeholder,
//     apply
// }) {
//     const [open, setOpen] = useState(false);
//     const [triggerWidth, setTriggerWidth] = useState(0);
//     const triggerRef = useRef(null);

//     useEffect(() => {
//         if (triggerRef.current) {
//             setTriggerWidth(triggerRef.current.offsetWidth);
//         }
//     }, [open]);

//     const handleSearch = () => {
//         apply()
//     }


//     return (
//         <div className="flex gap-2 items-center flex-1">
//             <Popover open={open} onOpenChange={setOpen}>
//                 <PopoverTrigger asChild>
//                     <Button
//                         ref={triggerRef}
//                         variant="outline"
//                         role="combobox"
//                         className="w-full justify-between"
//                         disabled={disabled}
//                     >
//                         {value ? value : placeholder}
//                         <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                     </Button>
//                 </PopoverTrigger>
//                 <PopoverContent
//                     className="p-0"
//                     align="start"
//                     style={{ width: triggerWidth ? `${triggerWidth}px` : "auto" }}
//                 >
//                     <Command>
//                         <CommandInput
//                             placeholder="Type to search..."
//                         />
//                         <Button onClick={handleSearch}  >
//                             Search
//                         </Button>
//                         <CommandList>
//                             <CommandEmpty>No items found.</CommandEmpty>
//                             <CommandGroup>
//                                 {data?.map((item) => (
//                                     <CommandItem
//                                         key={item.id}
//                                         onSelect={() => {
//                                             setValue(item.name);
//                                             setSearchTerm(item.name);
//                                             setItemId(item.id);
//                                             setOpen(false);
//                                         }}
//                                     >
//                                         {item.name}
//                                     </CommandItem>
//                                 ))}
//                             </CommandGroup>
//                         </CommandList>
//                     </Command>
//                 </PopoverContent>
//             </Popover>
//         </div>
//     );
// }




import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function SearchBoxV2({
    data,
    setItemId,
    disabled = false,
    value,
    setValue,
    placeholder,
    onSearch,     // NEW: search callback provided from parent
    apply,        // keeping your old logic as asked
}) {
    const [open, setOpen] = useState(false);
    const [triggerWidth, setTriggerWidth] = useState(0);
    const [searchTerm, setSearchTerm] = useState(""); // NEW: internal input state

    const triggerRef = useRef(null);

    useEffect(() => {
        if (triggerRef.current) {
            setTriggerWidth(triggerRef.current.offsetWidth);
        }
    }, [open]);

    // Call external search
    const handleSearch = () => {
        if (onSearch) onSearch(searchTerm);  // pass searchTerm outside
        apply?.();                           // keep old logic as you asked
    };

    return (
        <div className="flex gap-2 items-center flex-1">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        ref={triggerRef}
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                        disabled={disabled}
                    >
                        {value ? value : placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    className="p-0"
                    align="start"
                    style={{ width: triggerWidth ? `${triggerWidth}px` : "auto" }}
                >
                    <Command>
                        <CommandInput
                            placeholder="Type to search..."
                            value={searchTerm}
                            onValueChange={(text) => setSearchTerm(text)}
                        />

                        <div className="p-2">
                            <Button className="w-full" onClick={handleSearch}>
                                Search
                            </Button>
                        </div>

                        <CommandList>
                            <CommandEmpty>No items found.</CommandEmpty>
                            <CommandGroup>
                                {data?.map((item) => (
                                    <CommandItem
                                        key={item.id}
                                        onSelect={() => {
                                            setValue(item.name);
                                            setItemId(item.id);
                                            setOpen(false);
                                        }}
                                    >
                                        {item.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
