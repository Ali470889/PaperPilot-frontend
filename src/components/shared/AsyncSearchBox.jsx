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
// import { ChevronsUpDown, Search, Loader2 } from "lucide-react";
// import { useState, useRef, useEffect } from "react";

// export function AsyncSearchBox({
//     placeholder = "Select item...",
//     // value,
//     // setValue,
//     setItemId,
//     useSearchHook, // 👈 custom hook pass ہوگا یہاں
//     disabled = false,
// }) {
//     const [value, setValue] = useState("");

//     const [open, setOpen] = useState(false);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [search, setSearch] = useState("");
//     const triggerRef = useRef(null);

//     // 👇 hook کو searchTerm کے ساتھ call کریں
//     const { data = [], isLoading } = useSearchHook(search);

//     const handleSearch = () => {
//         setSearch(searchTerm); // 👈 manual API call
//     };

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
//                         {value || placeholder}
//                         <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                     </Button>
//                 </PopoverTrigger>

//                 <PopoverContent
//                     className="p-0"
//                     align="start"
//                 >
//                     <Command>
//                         {/* Search input + button */}
//                         <div className="flex justify-between gap-2 p-2">
//                             <CommandInput
//                                 placeholder="Type to search..."
//                                 value={searchTerm}
//                                 onValueChange={setSearchTerm}
//                                 className="flex-1"
//                             />

//                             <Button variant="outline" size="icon" onClick={handleSearch}>
//                                 {isLoading ? (
//                                     <Loader2 className="h-4 w-4 animate-spin" />
//                                 ) : (
//                                     <Search className="h-4 w-4" />
//                                 )}
//                             </Button>
//                         </div>

//                         <CommandList>
//                             {isLoading && (
//                                 <div className="p-4 text-sm text-muted-foreground">
//                                     Loading...
//                                 </div>
//                             )}

//                             {!isLoading && data.length === 0 && (
//                                 <CommandEmpty>No items found.</CommandEmpty>
//                             )}

//                             <CommandGroup>
//                                 {data?.items?.map((item) => (
//                                     <CommandItem
//                                         key={item.id}
//                                         onSelect={() => {
//                                             setValue(item.name);
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
import { ChevronsUpDown, Search, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function AsyncSearchBox({
    placeholder = "Select item...",
    setItemId,
    useSearchHook, // 👈 custom hook
    disabled = false,
    initialValue = "", // 👈 new prop for prefilled value
}) {
    const [value, setValue] = useState(initialValue);
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [search, setSearch] = useState("");
    const triggerRef = useRef(null);

    // Update value if initialValue changes (useful for dialog prefills)
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const { data = [], isLoading } = useSearchHook(search);

    const handleSearch = () => {
        setSearch(searchTerm); // 👈 trigger API call
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
                        {value || placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="p-0" align="start">
                    <Command>
                        {/* Search input + button */}
                        <div className="flex justify-between gap-2 p-2">
                            <CommandInput
                                placeholder="Type to search..."
                                value={searchTerm}
                                onValueChange={setSearchTerm}
                                className="flex-1"
                            />

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleSearch}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Search className="h-4 w-4" />
                                )}
                            </Button>
                        </div>

                        <CommandList>
                            {isLoading && (
                                <div className="p-4 text-sm text-muted-foreground">
                                    Loading...
                                </div>
                            )}

                            {!isLoading && data.length === 0 && (
                                <CommandEmpty>No items found.</CommandEmpty>
                            )}

                            <CommandGroup>
                                {data?.items?.map((item) => (
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
