import { useState } from "react";
import { useDeleteEmployeeMutation } from "@shared/lib/queries";

type DeleteTarget = {
  id: number;
  name: string;
} | null;

type UseDeleteConfirmationOptions = {
  onSuccess?: () => void;
};

export const useDeleteConfirmation = (
  options: UseDeleteConfirmationOptions = {},
) => {
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

  const deleteMutation = useDeleteEmployeeMutation({
    onSuccess: () => {
      setDeleteTarget(null);
      options.onSuccess?.();
    },
  });

  const openDeleteConfirmation = (id: number, name: string) => {
    setDeleteTarget({ id, name });
  };

  const closeDeleteConfirmation = () => {
    if (!deleteMutation.isPending) {
      setDeleteTarget(null);
    }
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id);
    }
  };

  return {
    deleteTarget,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error?.message ?? null,
    openDeleteConfirmation,
    closeDeleteConfirmation,
    confirmDelete,
  };
};
