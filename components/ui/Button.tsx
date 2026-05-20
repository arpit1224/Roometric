// import React from "react";
// // import "./Button.css";

// type Variant = "primary" | "secondary" | "danger" | "ghost";
// type Size = "sm" | "md" | "lg";

// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: Variant;
//   size?: Size;
//   fullWidth?: boolean;
//   className?: string;
//   children?: React.ReactNode;
// }

// export const Button = ({
//   variant = "primary",
//   size = "md",
//   fullWidth = false,
//   className,
//   children,
//   ...props
// }: ButtonProps) => {
//   const classes = [
//     "btn",
//     `btn--${variant}`,
//     `btn--${size}`,
//     fullWidth ? "btn--full-width" : "",
//     className ?? "",
//   ]
//     .filter(Boolean)
//     .join(" ");

//   return (
//     <button className={classes} {...props}>
//       {children}
//     </button>
//   );
// };

// export default Button;



// components/ui/Button.tsx

import React from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "success"
  | "danger"
  | "ghost"
  | "warning";

type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  ...props
}) => {
  const classes = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? "btn--full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;