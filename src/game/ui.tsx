import { motion } from "motion/react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Screen({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -14, filter: "blur(8px)" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn("mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-5 py-8", className)}
    >
      {children}
    </motion.div>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("glass rounded-3xl p-5", className)}>{children}</div>;
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger" | "success" | "outline";
  size?: "md" | "lg";
};

export function Button({ variant = "primary", size = "md", className, ...props }: BtnProps) {
  const base =
    "inline-flex w-full items-center justify-center gap-2 rounded-2xl font-bold uppercase tracking-wide transition-all duration-300 active:scale-95 disabled:pointer-events-none disabled:opacity-40";
  const sizes = { md: "px-5 py-3 text-sm", lg: "px-6 py-4 text-base" };
  const variants = {
    primary: "gradient-primary text-primary-foreground glow hover:brightness-110",
    danger: "gradient-danger text-destructive-foreground glow-danger hover:brightness-110",
    success: "gradient-success text-success-foreground glow-success hover:brightness-110",
    outline: "glass text-foreground hover:bg-white/10",
    ghost: "text-muted-foreground hover:text-foreground",
  };
  return <button className={cn(base, sizes[size], variants[variant], className)} {...props} />;
}

export function Title({ eyebrow, children }: { eyebrow?: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {eyebrow}
        </p>
      )}
      <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground">
        {children}
      </h1>
    </div>
  );
}
