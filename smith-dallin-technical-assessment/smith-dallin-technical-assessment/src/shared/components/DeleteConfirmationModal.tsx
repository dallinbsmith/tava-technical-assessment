import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { Modal } from "./Modal";
import { DeleteConfirmationModalProps } from "../__types__";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  itemName,
  error,
}: DeleteConfirmationModalProps) => (
  <Modal
    isOpen={isOpen}
    onClose={() => !isDeleting && onClose()}
    title="Confirm Removal"
    icon={AlertTriangle}
    footer={
      <>
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="px-4 py-2 text-sm font-medium text-primary bg-elevated border border-border hover:bg-muted transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {isDeleting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Removing...
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              Remove
            </>
          )}
        </button>
      </>
    }
  >
    <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 mb-4">
      <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-red-300">
        <p className="font-medium mb-1">This action cannot be undone.</p>
        <p>This will permanently remove this item from the system.</p>
      </div>
    </div>

    <p className="text-primary">
      Are you sure you want to remove <strong>{itemName}</strong>?
    </p>

    {error && <p className="text-sm text-red-400 mt-4">{error}</p>}
  </Modal>
);

export default DeleteConfirmationModal;
