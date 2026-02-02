import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  useEmployeeQuery,
  useAvatarMutation,
  useDeleteEmployeeMutation,
} from "@shared/lib/queries";
import EmployeeHeader from "./EmployeeHeader";
import EmployeeInfo from "./EmployeeInfo";
import DeleteConfirmationModal from "@shared/components/DeleteConfirmationModal";

const EmployeeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const employeeId = parseInt(id!);

  const { data: employee, isLoading, error } = useEmployeeQuery(employeeId);
  const avatarMutation = useAvatarMutation(employeeId);

  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const deleteMutation = useDeleteEmployeeMutation({
    onSuccess: () => navigate("/"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="card p-8 text-center">
        <p className="text-red-400">
          {error instanceof Error ? error.message : "Employee not found"}
        </p>
        <Link
          to="/"
          className="text-sky-400 hover:text-sky-300 mt-4 inline-block"
        >
          Back to list
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to list
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/employees/${id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-sky-900/40 text-sky-300 border border-sky-700/50 hover:bg-sky-800/50 transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={() =>
              setDeleteTarget({
                id: employee.id,
                name: `${employee.firstName} ${employee.lastName}`,
              })
            }
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-900/30 text-red-300 border border-red-700/40 hover:bg-red-800/40 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <EmployeeHeader
          employee={employee}
          onAvatarUpload={(url) => avatarMutation.mutateAsync(url)}
        />
        <EmployeeInfo employee={employee} />
      </div>

      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => !deleteMutation.isPending && setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        isDeleting={deleteMutation.isPending}
        itemName={deleteTarget?.name ?? ""}
        error={deleteMutation.error?.message ?? null}
      />
    </div>
  );
};

export default EmployeeDetailPage;
