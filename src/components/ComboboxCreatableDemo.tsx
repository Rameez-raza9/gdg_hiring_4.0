"use client";

import { useId, useRef, useState, useEffect } from "react";
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";

const initialLabels = [
  { value: "web-dev", label: "Web Development", color: "bg-blue-500" },
  { value: "android-dev", label: "Android & Mobile", color: "bg-emerald-500" },
  { value: "cloud-devops", label: "Cloud & GCP", color: "bg-amber-500" },
  { value: "ai-ml", label: "AI & Machine Learning", color: "bg-purple-500" },
  { value: "ui-ux", label: "UI/UX & Design", color: "bg-pink-500" },
  { value: "event-ops", label: "Event Management", color: "bg-teal-500" },
  { value: "pr-outreach", label: "PR & Outreach", color: "bg-orange-500" },
];

const labelColors = [
  "bg-green-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-indigo-500",
  "bg-rose-500",
];

export interface ComboboxCreatableProps {
  value?: string;
  onChange?: (val: string) => void;
  className?: string;
  placeholder?: string;
}

export const ComboboxCreatableDemo = ({
  value: controlledValue,
  onChange,
  className,
  placeholder = "Select or create specialization tag",
}: ComboboxCreatableProps) => {
  const id = useId();
  const colorIndexRef = useRef(0);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [labels, setLabels] =
    useState<{ value: string; label: string; color: string }[]>(initialLabels);
  const [internalValue, setInternalValue] = useState("");
  const [mounted, setMounted] = useState(false);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setMounted(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setMounted(false);
    }
  }, [open]);

  const selected = labels.find((l) => l.value === value || l.label.toLowerCase() === value?.toLowerCase());

  const trimmed = query.trim();
  const exactMatch = labels.some(
    (l) => l.label.toLowerCase() === trimmed.toLowerCase(),
  );
  const showCreate = trimmed.length > 0 && !exactMatch;

  const handleCreate = () => {
    const newValue = trimmed.toLowerCase().replace(/\s+/g, "-");
    const color = labelColors[colorIndexRef.current % labelColors.length];
    colorIndexRef.current += 1;
    const newLabel = { value: newValue, label: trimmed, color };
    setLabels((prev) => [...prev, newLabel]);
    if (onChange) {
      onChange(trimmed);
    } else {
      setInternalValue(newValue);
    }
    setQuery("");
    setOpen(false);
  };

  return (
    <div className={cn("w-full max-w-sm", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="bg-neutral-900 border-neutral-800 hover:bg-neutral-800 text-white w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-2 cursor-pointer h-10"
          >
            {selected ? (
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "size-2 rounded-full shrink-0",
                    selected.color,
                  )}
                />
                <span className="truncate">{selected.label}</span>
              </span>
            ) : value ? (
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full shrink-0 bg-blue-500" />
                <span className="truncate">{value}</span>
              </span>
            ) : (
              <span className="text-neutral-400">
                {placeholder}
              </span>
            )}
            <ChevronsUpDownIcon
              className="text-neutral-400 shrink-0 size-4"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="border-neutral-800 bg-neutral-950 text-white w-72 p-0 shadow-xl"
          align="start"
          initialFocus={false}
        >
          {mounted && (
            <Command>
              <CommandInput
                placeholder="Search or create label..."
                value={query}
                onValueChange={setQuery}
              />
              <CommandList>
                <CommandEmpty className={cn(showCreate && "hidden")}>
                  No label found.
                </CommandEmpty>
                <CommandGroup>
                  {labels.map((label) => (
                    <CommandItem
                      key={label.value}
                      value={label.label}
                      onSelect={() => {
                        const nextVal = label.value === value ? "" : label.label;
                        if (onChange) {
                          onChange(nextVal);
                        } else {
                          setInternalValue(label.value === value ? "" : label.value);
                        }
                        setQuery("");
                        setOpen(false);
                      }}
                      className="[&>svg:last-of-type]:hidden hover:bg-neutral-800 text-neutral-200"
                    >
                      <span className="flex grow items-center gap-2">
                        <span
                          className={cn(
                            "size-2 rounded-full shrink-0",
                            label.color,
                          )}
                        />
                        {label.label}
                      </span>
                      <CheckIcon
                        className={cn(
                          "size-4 transition-opacity text-emerald-400",
                          (value === label.value || value === label.label) ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                  {showCreate && (
                    <CommandItem
                      value={`__create__${trimmed}`}
                      onSelect={handleCreate}
                      className="[&>svg:last-of-type]:hidden text-neutral-400 hover:bg-neutral-800"
                    >
                      <PlusIcon className="size-4 shrink-0 mr-1 text-emerald-400" />
                      Create
                      <Badge
                        variant="secondary"
                        className="ml-1 rounded px-1.5 py-0 font-medium leading-5 bg-neutral-800 text-white"
                      >
                        {trimmed}
                      </Badge>
                    </CommandItem>
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ComboboxCreatableDemo;
