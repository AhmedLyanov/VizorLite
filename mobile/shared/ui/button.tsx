import * as React from "react";
import {
  Pressable,
  Text,
  type PressableProps,
  ActivityIndicator,
} from "react-native";

import { cn } from "@/shared/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends PressableProps {
  children: React.ReactNode;
  className?: string;
  textClassName?: string;

  variant?: ButtonVariant;

  loading?: boolean;
  disabled?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary active:opacity-80",
  secondary: "bg-secondary active:opacity-80",
  ghost: "bg-transparent border border-neutral-200 active:opacity-70",
  danger: "bg-red-500 active:opacity-80",
};

const textVariants: Record<ButtonVariant, string> = {
  primary: "text-white",
  secondary: "text-title",
  ghost: "text-title",
  danger: "text-white",
};

export function Button({
  children,
  className,
  textClassName,

  variant = "primary",

  loading = false,
  disabled = false,

  ...props
}: ButtonProps) {
  return (
    <Pressable
      disabled={disabled || loading}
      className={cn(
        "flex-row items-center justify-center rounded-2xl px-5 py-4",
        disabled && "opacity-50",
        variants[variant],
        className
      )}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text
          className={cn(
            "text-base font-semibold",
            textVariants[variant],
            textClassName
          )}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}