import * as React from "react";
import { Text, type TextProps } from "react-native";

import { cn } from "@/shared/lib/cn";

type TypographyVariant =
  | "title"
  | "body"
  | "caption"
  | "small";

interface TypographyProps extends TextProps {
  children: React.ReactNode;
  className?: string;
  variant?: TypographyVariant;
}

const variants: Record<TypographyVariant, string> = {
  title: "text-3xl font-semibold text-(--primary-title-color)",
  body: "text-base font-medium text-neutral-700",
  caption: "text-sm text-neutral-500",
  small: "text-xs text-neutral-400",
};

export function Typography({
  children,
  className,
  variant = "body",
  ...props
}: TypographyProps) {
  return (
    <Text className={cn(variants[variant], className)} {...props}>
      {children}
    </Text>
  );
}