import {
  Image as ExpoImage,
  type ImageProps,
} from "expo-image";

import { cn } from "@/shared/lib/cn";

interface AppImageProps extends ImageProps {
  className?: string;
}

export function Image({
  className,
  style,
  ...props
}: AppImageProps) {
  return (
    <ExpoImage
      style={style}
      className={cn(className)}
      {...props}
    />
  );
}