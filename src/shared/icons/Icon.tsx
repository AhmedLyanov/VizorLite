import { icons, IconName } from "./icons";

type Props = {
  name: IconName;
  size?: number;
  className?: string;
};

export function Icon({ name, size = 24, className }: Props) {
  const Svg = icons[name];

  return (
    <Svg
      width={size}
      height={size}
      className={className}
      aria-hidden
    />
  );
}
