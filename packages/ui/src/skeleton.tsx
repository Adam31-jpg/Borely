import * as React from "react";
import { cn } from "./utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-skeleton-pulse rounded-xl bg-surface-elevated",
                className
            )}
            {...props}
        />
    );
}
