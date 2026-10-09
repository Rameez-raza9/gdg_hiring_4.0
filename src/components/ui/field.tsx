import * as React from "react";
import { cn } from "@/lib/utils";

export const Field = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { "data-invalid"?: boolean; orientation?: "vertical" | "horizontal" | "responsive" }
>(({ className, orientation = "vertical", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "space-y-1.5",
      orientation === "horizontal" && "flex items-center space-x-2 space-y-0",
      className
    )}
    {...props}
  />
));
Field.displayName = "Field";

export const FieldGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-4", className)} {...props} />
));
FieldGroup.displayName = "FieldGroup";

export const FieldLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-xs font-semibold uppercase tracking-wider text-neutral-300 block",
      className
    )}
    {...props}
  />
));
FieldLabel.displayName = "FieldLabel";

export const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-xs text-neutral-400", className)} {...props} />
));
FieldDescription.displayName = "FieldDescription";

export const FieldError = ({
  errors,
}: {
  errors?: { message: string }[] | null;
}) => {
  if (!errors || errors.length === 0) return null;
  return (
    <div className="space-y-1">
      {errors.map((err, i) => (
        <p key={i} className="text-xs text-red-400 font-medium">
          {err.message}
        </p>
      ))}
    </div>
  );
};
