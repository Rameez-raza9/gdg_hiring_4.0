"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronsUpDown, Globe, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Language = {
  code: string;
  name: string;
  native: string;
  greeting: string;
  rtl?: boolean;
};

type Region = {
  label: string;
  languages: Language[];
};

const POPULAR: Language[] = [
  { code: "EN", name: "English", native: "English", greeting: "Hello" },
  { code: "ES", name: "Spanish", native: "Español", greeting: "Hola" },
  { code: "FR", name: "French", native: "Français", greeting: "Bonjour" },
  { code: "DE", name: "German", native: "Deutsch", greeting: "Hallo" },
];

const REGIONS: Region[] = [
  {
    label: "Asia",
    languages: [
      { code: "TE", name: "Telugu", native: "తెలుగు", greeting: "నమస్కారం" },
      { code: "HI", name: "Hindi", native: "हिन्दी", greeting: "नमस्ते" },
      { code: "TA", name: "Tamil", native: "தமிழ்", greeting: "வணக்கம்" },
      { code: "ZH", name: "Chinese", native: "中文", greeting: "你好" },
      { code: "JA", name: "Japanese", native: "日本語", greeting: "こんにちは" },
    ],
  },
  {
    label: "Europe",
    languages: [
      { code: "IT", name: "Italian", native: "Italiano", greeting: "Ciao" },
      { code: "PT", name: "Portuguese", native: "Português", greeting: "Olá" },
      { code: "RU", name: "Russian", native: "Русский", greeting: "Привет" },
      { code: "NL", name: "Dutch", native: "Nederlands", greeting: "Hallo" },
    ],
  },
  {
    label: "Middle East",
    languages: [
      { code: "AR", name: "Arabic", native: "العربية", greeting: "مرحبا", rtl: true },
      { code: "HE", name: "Hebrew", native: "עברית", greeting: "שלום", rtl: true },
      { code: "TR", name: "Turkish", native: "Türkçe", greeting: "Merhaba" },
      { code: "FA", name: "Persian", native: "فارسی", greeting: "سلام", rtl: true },
    ],
  },
];

const ALL_LANGUAGES = [...POPULAR, ...REGIONS.flatMap((r) => r.languages)];

const SPRING = { type: "spring", bounce: 0.25, duration: 0.5 } as const;

const itemClass = "cursor-pointer gap-3 rounded-lg p-2 text-sm";

const LanguageItem = ({
  item,
  index,
  selected,
}: {
  item: Language;
  index: number;
  selected: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -14 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ ...SPRING, delay: 0.04 + index * 0.045 }}
  >
    <DropdownMenuRadioItem value={item.code} className={itemClass}>
      <motion.span
        animate={{ scale: selected ? 1.1 : 1, rotate: selected ? -6 : 0 }}
        transition={SPRING}
        className={
          selected
            ? "flex size-7 shrink-0 items-center justify-center rounded-md bg-white text-xs font-semibold text-black"
            : "flex size-7 shrink-0 items-center justify-center rounded-md bg-neutral-800 text-xs font-semibold text-white"
        }
      >
        {item.code}
      </motion.span>
      <span className="flex min-w-0 flex-1 flex-col leading-tight">
        <span className="truncate text-sm font-medium text-white">{item.native}</span>
        <span className="truncate text-xs text-neutral-400">
          {item.name}
        </span>
      </span>
      {item.rtl && (
        <Badge variant="outline" className="mr-5 shrink-0 text-[10px]">
          RTL
        </Badge>
      )}
    </DropdownMenuRadioItem>
  </motion.div>
);

type Props = {
  defaultOpen?: boolean;
};

export const DropdownMenu11 = ({ defaultOpen = false }: Props) => {
  const [open, setOpen] = useState(defaultOpen);
  const [selected, setSelected] = useState("EN");
  const [autoTranslate, setAutoTranslate] = useState(true);

  const current =
    ALL_LANGUAGES.find((item) => item.code === selected) ?? ALL_LANGUAGES[0];

  return (
    <div className="flex justify-center">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-9 min-w-44 cursor-pointer justify-between gap-2.5 rounded-full px-3 py-1.5 border-neutral-800 bg-neutral-900/80 text-white hover:bg-neutral-800 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <motion.span
                animate={{ rotate: open ? 360 : 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="flex"
              >
                <Globe className="size-3.5 text-neutral-400" />
              </motion.span>
              <span className="relative inline-flex h-5 items-center overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={current.code}
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -16, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs font-medium text-neutral-200"
                  >
                    {current.native}
                  </motion.span>
                </AnimatePresence>
              </span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-neutral-800 text-neutral-300">
                {current.code}
              </Badge>
            </span>
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <ChevronsUpDown className="size-3.5 text-neutral-400" />
            </motion.span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" sideOffset={10} className="w-80 p-2 border-neutral-800 bg-neutral-950/95 backdrop-blur-2xl">
          <DropdownMenuRadioGroup value={selected} onValueChange={setSelected}>
            <DropdownMenuLabel className="px-2 pt-2 text-xs uppercase tracking-wide text-neutral-400">
              Popular Languages
            </DropdownMenuLabel>
            {POPULAR.map((item, index) => (
              <LanguageItem
                key={item.code}
                item={item}
                index={index}
                selected={item.code === selected}
              />
            ))}
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-2 pt-1 text-xs uppercase tracking-wide text-neutral-400">
              Regional Languages
            </DropdownMenuLabel>
            {REGIONS.map((region, index) => {
              const active = region.languages.some(
                (item) => item.code === selected
              );
              return (
                <motion.div
                  key={region.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...SPRING, delay: 0.25 + index * 0.06 }}
                >
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className={itemClass}>
                      <span className="flex-1 font-medium text-neutral-200">{region.label}</span>
                      <AnimatePresence initial={false}>
                        {active && (
                          <motion.span
                            initial={{ scale: 0.4, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.4, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            <Badge className="bg-white text-black text-[10px] mr-2">
                              {current.code}
                            </Badge>
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <span className="text-xs text-neutral-400 mr-2">
                        {region.languages.length}
                      </span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-64 p-2 border-neutral-800 bg-neutral-950">
                      <DropdownMenuRadioGroup
                        value={selected}
                        onValueChange={setSelected}
                      >
                        {region.languages.map((item, i) => (
                          <LanguageItem
                            key={item.code}
                            item={item}
                            index={i}
                            selected={item.code === selected}
                          />
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </motion.div>
              );
            })}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.45 }}
          >
            <DropdownMenuCheckboxItem
              checked={autoTranslate}
              onCheckedChange={setAutoTranslate}
              className={itemClass}
            >
              <motion.span
                animate={{
                  rotate: autoTranslate ? [0, -15, 15, 0] : 0,
                  scale: autoTranslate ? 1 : 0.85,
                }}
                transition={{ duration: 0.4 }}
                className="flex mr-2"
              >
                <Sparkles
                  className={
                    autoTranslate
                      ? "size-4 text-amber-400"
                      : "size-4 text-neutral-400"
                  }
                />
              </motion.span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-medium text-white">Auto-translate chapter</span>
                <span className="text-xs text-neutral-400">
                  Translate content on the fly
                </span>
              </span>
            </DropdownMenuCheckboxItem>
          </motion.div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropdownMenu11;
