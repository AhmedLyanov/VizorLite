import { icons } from "./elements/Icons_aside";
import { roomIcons } from "./elements/icons_roomboard";

const allIcons = {
  ...icons,
  ...roomIcons,
};

type IconName = keyof typeof allIcons;

type Props = {
  name: IconName;
  size?: number;
  className?: string;
};

export function Icon({ name, size = 24, className }: Props) {
  const Svg = allIcons[name];
  
  if (!Svg) {
    return null;
  }
  
  return <Svg width={size} height={size} className={className} />;
}

export type { IconName };