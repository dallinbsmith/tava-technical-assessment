import { cn } from "@shared/lib/styles";
import {
  FormRowProps,
  FormFieldProps,
  FormInputProps,
  FormTextAreaProps,
} from "../__types__";

export const FormRow = ({ children, className }: FormRowProps) => (
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
}: FormFieldProps) => (
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

export const FormInput = ({ error, className, ...props }: FormInputProps) => (
  <input
    className={cn("input-field", error && "error", className)}
    {...props}
  />
);

export const FormTextArea = ({
  error,
  className,
  ...props
}: FormTextAreaProps) => (
  <textarea
    className={cn("input-field resize-none", error && "error", className)}
    {...props}
  />
);
