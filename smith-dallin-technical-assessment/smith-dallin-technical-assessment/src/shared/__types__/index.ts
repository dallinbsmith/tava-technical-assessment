import { ReactNode } from "react";
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
