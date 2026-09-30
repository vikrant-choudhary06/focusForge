import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, glow = false, children, style, ...props }) => {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "var(--border-card)",
        borderRadius: "var(--card-radius)",
        boxShadow: "var(--card-shadow)",
        backdropFilter: "blur(var(--backdrop-blur))",
        ...style,
      }}
      className={cn(
        "p-6 transition-all duration-300 relative",
        glow && "shadow-glow",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

