import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { LucideIcon } from "lucide-react";

export interface IconSelectOption {
  value: string | number;
  label: string;
  icon?: LucideIcon;
  iconColor?: string;
}

interface IconSelectProps {
  options: IconSelectOption[];
  value?: string | number;
  onValueChange?: (value: string | number) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
}

export function CustomSelect({
  options,
  value,
  onValueChange,
  onSearch,
  placeholder = "Sélectionner...",
  searchable = false,
  disabled = false,
  className,
}: IconSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [internalSearchQuery, setInternalSearchQuery] = React.useState("");

  const selectedOption = options.find((option) => option.value === value);

  // If no external onSearch is provided, we filter locally as the user types.
  // If onSearch IS provided, we just show the `options` passed in by the parent.
  const filteredOptions =
    !onSearch && searchable && internalSearchQuery
      ? options.filter((option) =>
          option.label
            .toLowerCase()
            .includes(internalSearchQuery.toLowerCase()),
        )
      : options;

  const handleSelect = (selectedValue: string | number) => {
    onValueChange?.(selectedValue);
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setInternalSearchQuery(""); // Clean up search when dropdown closes
    }
  };

  // Only updates the visual input, does NOT trigger parent search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalSearchQuery(e.target.value);
  };

  // Triggers the parent search ONLY when Enter is pressed
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      e.preventDefault();
      e.stopPropagation(); // <-- Prevents Command from handling Enter and closing the dropdown
      onSearch(internalSearchQuery);
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal={true}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "[&>span]:line-clamp-1",
            className,
          )}
        >
          {selectedOption ? (
            <div className="flex items-center gap-2">
              {selectedOption.icon && (
                <selectedOption.icon
                  className={cn("h-4 w-4", selectedOption.iconColor)}
                />
              )}
              <span>{selectedOption.label}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        {searchable ? (
          <Command shouldFilter={false}>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                type="text"
                placeholder="Rechercher... (Appuyez sur Entrée)"
                value={internalSearchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown} // <-- Added KeyDown listener
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
              />
            </div>
            <CommandList>
              <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <CommandItem
                      key={String(option.value)}
                      value={String(option.value)}
                      onSelect={() => handleSelect(option.value)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      {IconComponent && (
                        <IconComponent
                          className={cn("h-4 w-4", option.iconColor)}
                        />
                      )}
                      <span>{option.label}</span>
                      {option.value === value && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        ) : (
          <div className="max-h-[300px] overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Aucune option disponible
              </div>
            ) : (
              filteredOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <div
                    key={String(option.value)}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none",
                      "hover:bg-neutral-100 hover:text-neutral-900",
                      option.value === value &&
                        "bg-accent text-accent-foreground",
                    )}
                  >
                    {IconComponent && (
                      <IconComponent
                        className={cn("h-4 w-4", option.iconColor)}
                      />
                    )}
                    <span>{option.label}</span>
                    {option.value === value && (
                      <span className="absolute right-2">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
