import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with conflict resolution.
 * Usage: cn("px-4 py-2", conditional && "bg-accent", className)
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
