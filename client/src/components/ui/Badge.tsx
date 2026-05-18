import { classNames } from "../../lib/classNames";

interface BadgeProps {
  children: string;
  className?: string;
}

export const Badge = ({ children, className }: BadgeProps): JSX.Element => {
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        className
      )}
    >
      {children}
    </span>
  );
};
