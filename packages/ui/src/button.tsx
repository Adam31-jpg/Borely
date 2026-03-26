import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const buttonVariants = cva(
    [
        "inline-flex items-center justify-center gap-2",
        "rounded-xl font-medium text-sm",
        "transition-colors duration-200",
        "tap-target",
        "disabled:opacity-50 disabled:pointer-events-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        "focus-visible:ring-offset-surface-primary",
    ].join(" "),
    {
        variants: {
            variant: {
                primary: "bg-accent text-white hover:bg-accent-hover shadow-sm",
                secondary:
                    "bg-surface-card text-content-primary border border-border hover:bg-surface-elevated",
                ghost:
                    "text-content-muted hover:text-content-primary hover:bg-surface-elevated",
                danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20",
            },
            size: {
                sm: "h-9 px-3 text-xs",
                md: "h-11 px-5",
                lg: "h-13 px-7 text-base",
                icon: "h-11 w-11",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { }

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(buttonVariants({ variant, size, className }))}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";
