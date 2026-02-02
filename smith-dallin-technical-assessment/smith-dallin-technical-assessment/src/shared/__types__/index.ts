import { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { LucideIcon } from "lucide-react";

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  icon?: LucideIcon;
};

export type DeleteConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  itemName: string;
  error?: string | null;
};

export type FormRowProps = {
  children: ReactNode;
  className?: string;
};

export type FormFieldProps = {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  htmlFor?: string;
};

export type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

export type FormTextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
};
