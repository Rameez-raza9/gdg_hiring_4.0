"use client";

import React, { forwardRef } from "react";
import { cx } from "@/utils/cx";

export const Input = forwardRef(function Input(
    {
        label,
        name,
        type = "text",
        placeholder,
        value,
        onChange,
        error,
        hint,
        className,
        required,
        iconLeading: IconLeading,
        ...props
    },
    ref
) {
    return (
        <div className="w-full flex flex-col gap-1.5 text-left">
            {label && (
                <label htmlFor={name} className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative w-full">
                {IconLeading && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                        <IconLeading className="w-4 h-4" />
                    </div>
                )}
                <input
                    ref={ref}
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className={cx(
                        "w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white dark:bg-neutral-900 border text-neutral-900 dark:text-neutral-100 transition-all outline-none",
                        "border-neutral-300 dark:border-neutral-700 focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/20",
                        IconLeading && "pl-9",
                        error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                        className
                    )}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">{error}</p>}
            {hint && !error && <p className="text-xs text-neutral-500 mt-0.5">{hint}</p>}
        </div>
    );
});
