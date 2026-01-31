import { Link } from "react-router-dom";
import { Building2, ChevronRight, Trash2 } from "lucide-react";
import { EmployeeRowProps } from "./utils/__types__";
import Avatar from "./Avatar";

const EmployeeRow = ({ employee, onDelete }: EmployeeRowProps) => {
  const { id, firstName, lastName, title, department, avatarUrl, status } =
    employee;
  const isInactive = status === "inactive";

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete();
  };

  return (
    <Link
      to={`/employees/${id}`}
      className="card-interactive flex items-center gap-4 p-4 group"
    >
      <Avatar
        src={avatarUrl}
        firstName={firstName}
        lastName={lastName}
        size="md"
        inactive={isInactive}
        className="ring-2 ring-border group-hover:ring-sky-500/50 transition-all"
      />
      <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-4">
        <div className="min-w-0">
          <h3 className="font-semibold text-primary group-hover:text-sky-400 transition-colors truncate">
            {firstName} {lastName}
          </h3>
          <p className="text-sm text-muted truncate">{title}</p>
        </div>
        <div className="text-sm text-muted flex items-center gap-2">
          <Building2 className="w-4 h-4 hidden sm:block" />
          <span className="truncate">{department}</span>
        </div>
        {isInactive && (
          <span className="text-xs text-subtle hidden sm:block">
            (deactivated)
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleDeleteClick}
          className="p-2 hover:bg-red-900/50 transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4 text-muted hover:text-red-400" />
        </button>
        <ChevronRight className="w-5 h-5 text-muted group-hover:text-sky-400 transition-all" />
      </div>
    </Link>
  );
};

export default EmployeeRow;
