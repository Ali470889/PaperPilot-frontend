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
import { ChevronsUpDown, Search, SearchX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";

export function SearchBox({
  data,
  setItemId,
  disabled = false,
  value,
  setValue,
  searchTerm,
  setSearchTerm,
  placeholder,
}) {
  const [open, setOpen] = useState(false);
  const [triggerWidth, setTriggerWidth] = useState(0);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

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
              onValueChange={setSearchTerm}
            />
            <CommandList>
              <CommandEmpty>No items found.</CommandEmpty>
              <CommandGroup>
                {data?.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => {
                      setValue(item.name);
                      setSearchTerm(item.name);
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
