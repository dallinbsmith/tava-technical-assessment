import { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@shared/lib/styles";

export const FormRow = ({
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

export const FormField = ({
  label,
  required,
  error,
  children,
  htmlFor,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  htmlFor?: string;
}) => (
  <div>
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-muted mb-1.5"
    >
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
  </div>
);

export const FormInput = ({
  error,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) => (
  <input
    className={cn("input-field", error && "error", className)}
    {...props}
  />
);

export const FormTextArea = ({
  error,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }) => (
  <textarea
    className={cn("input-field resize-none", error && "error", className)}
    {...props}
  />
);
