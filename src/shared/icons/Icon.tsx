import { icons } from "./Icons";

type IconName = keyof typeof icons;

type Props = {
  name: IconName;
  size?: number;
};

export function Icon({ name, size = 24 }: Props) {
  const Svg = icons[name];
  return <Svg width={size} height={size} />;
}
