import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
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

export function Combobox({
  data,
  entityName,
  value,
  setValue,
  valueField,
  labelField,
  disabled = false,
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="bg-white">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
          disabled={disabled}
        >
          {value
            ? data.find((item) => item[valueField] === value)?.[labelField]
            : `Select ${entityName}...`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 ">
        <Command>
          <CommandInput
            placeholder={`Search ${entityName}...`}
            className="h-12 "
          />
          <CommandList>
            <CommandEmpty>No {entityName} found.</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item[valueField]}
                  value={item[labelField]}
                  onSelect={() => {
                    setValue(
                      item[valueField] === value ? "" : item[valueField]
                    );
                    setOpen(false);
                  }}
                >
                  {item[labelField]}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === item[valueField] ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
