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
