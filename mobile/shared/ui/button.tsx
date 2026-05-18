import * as React from "react";

import {
  Pressable,
  View,
  Text,
  ActivityIndicator,
  type PressableProps,
} from "react-native";

import { cn } from "@/shared/lib/cn";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger";

interface ButtonProps extends PressableProps {
  children: React.ReactNode;

  className?: string;
  textClassName?: string;

  variant?: ButtonVariant;

  loading?: boolean;
  disabled?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  ghost: "border border-neutral-200 bg-transparent",
  danger: "bg-red-500",
};

const textVariants: Record<ButtonVariant, string> = {
  primary: "text-(--primary-background-color)",
  secondary: "text-(--primary-background-color)",
  ghost: "text-(--primary-background-color)",
  danger: "text-(--primary-background-color)",
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
        "rounded-2xl px-5 py-4",
        disabled && "opacity-50",
        variants[variant],
        className
      )}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <View className="flex-row items-center justify-center gap-2">
          {React.Children.map(children, (child) => {
            if (typeof child === "string") {
              return (
                <Text
                  className={cn(
                    "text-base font-semibold",
                    textVariants[variant],
                    textClassName
                  )}
                >
                  {child}
                </Text>
              );
            }

            return child;
          })}
        </View>
      )}
    </Pressable>
  );
}