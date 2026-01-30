import { X } from "lucide-react";
import { ModalProps } from "../__types__";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  icon: TitleIcon,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-surface border border-border w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            {TitleIcon && <TitleIcon className="w-4 h-4 text-muted" />}
            <h2 className="font-semibold text-primary">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-elevated transition-colors"
          >
            <X className="w-4 h-4 text-muted" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
        {footer && (
          <div className="flex gap-3 p-4 border-t border-border">{footer}</div>
        )}
      </div>
    </div>
  );
};
