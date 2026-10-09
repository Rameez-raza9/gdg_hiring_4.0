"use client";

import React, { forwardRef } from "react";
import { Button as AriaButton } from "react-aria-components";
import { cx } from "@/utils/cx";

export const Button = forwardRef(function Button(
    {
        children,
        className,
        color = "primary",
        size = "md",
        iconLeading: IconLeading,
        iconTrailing: IconTrailing,
        isDisabled,
        disabled,
        ...props
    },
    ref
) {
    const isActuallyDisabled = isDisabled || disabled;

    const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-150 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const sizeStyles = {
        sm: "px-3 py-1.5 text-xs rounded-md gap-1.5",
        md: "px-4 py-2 text-sm rounded-lg gap-2",
        lg: "px-5 py-2.5 text-base rounded-lg gap-2.5",
    };

    const colorStyles = {
        primary: "bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-xs focus-visible:ring-[#0284c7]",
        secondary: "bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 shadow-xs focus-visible:ring-neutral-400 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800",
        tertiary: "bg-transparent hover:bg-neutral-100 text-neutral-600 focus-visible:ring-neutral-400 dark:text-neutral-300 dark:hover:bg-neutral-800",
        destructive: "bg-red-600 hover:bg-red-700 text-white shadow-xs focus-visible:ring-red-600",
    };

    return (
        <AriaButton
            ref={ref}
            isDisabled={isActuallyDisabled}
            className={cx(baseStyles, sizeStyles[size] || sizeStyles.md, colorStyles[color] || colorStyles.primary, className)}
            {...props}
        >
            {IconLeading && <IconLeading className="w-4 h-4 shrink-0" />}
            {children}
            {IconTrailing && <IconTrailing className="w-4 h-4 shrink-0" />}
        </AriaButton>
    );
});
