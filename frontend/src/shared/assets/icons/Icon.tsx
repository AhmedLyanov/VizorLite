import { icons } from "./elements/Icons_aside";
import { roomIcons } from "./elements/icons_roomboard";
import type { SVGProps } from "react";

const allIcons = {
  ...icons,
  ...roomIcons,
};

type IconName = keyof typeof allIcons;

type Props = {
  name: IconName;
  size?: number;
  className?: string;
  fill?: string;
  style?: React.CSSProperties;
} & SVGProps<SVGSVGElement>;

export function Icon({ name, size = 24, className, fill, style, ...props }: Props) {
  const Svg = allIcons[name];
  
  if (!Svg) {
    return null;
  }
  
  return <Svg width={size} height={size} className={className} fill={fill} style={style} {...props} />;
}

export type { IconName };