import { ReactNode } from "react";
import { cn } from "../../../shared/lib/styles";
import { FieldProps, InputProps, TextAreaProps } from "../__types__";

export const Row = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4", className)}>
    {children}
  </div>
);

export const Field = ({
  label,
  required,
  error,
  children,
  htmlFor,
  action,
}: FieldProps) => (
  <div>
    <div
      className={cn(
        "flex items-center mb-1.5",
        action ? "justify-between" : "",
      )}
    >
      <label htmlFor={htmlFor} className="block text-sm font-medium text-muted">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {action}
    </div>
    {children}
    {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
  </div>
);

export const Input = ({ error, className, ...props }: InputProps) => (
  <input
    className={cn("input-field", error && "error", className)}
    {...props}
  />
);

export const TextArea = ({ error, className, ...props }: TextAreaProps) => (
  <textarea
    className={cn("input-field resize-none", error && "error", className)}
    {...props}
  />
);
