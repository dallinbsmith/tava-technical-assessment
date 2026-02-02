import { Link } from "react-router-dom";
import { Building2, Calendar } from "lucide-react";
import { EmployeeCardProps } from "../__types__";
import Avatar from "./Avatar";

const formatDateShort = (dateString?: string) =>
  dateString
    ? new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Not specified";

const EmployeeCard = ({ employee }: EmployeeCardProps) => {
  const {
    id,
    firstName,
    lastName,
    title,
    department,
    dateStarted,
    avatarUrl,
    status,
  } = employee;
  const isInactive = status === "inactive";

  return (
    <Link
      to={`/employees/${id}`}
      className="card-interactive block p-5 group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-sky-900/0 to-sky-800/0 group-hover:from-sky-900/20 group-hover:to-sky-800/10 transition-all duration-300" />
      <div className="relative">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Avatar
              src={avatarUrl}
              firstName={firstName}
              lastName={lastName}
              size="lg"
              inactive={isInactive}
              className="ring-2 ring-border group-hover:ring-sky-500/50 transition-all"
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-primary group-hover:text-sky-400 transition-colors truncate">
                {firstName} {lastName}
              </h3>
              <p className="text-sm text-muted truncate">{title}</p>
              {isInactive && (
                <span className="text-xs text-subtle mt-1 block">
                  (deactivated)
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2 pt-3 border-t border-border group-hover:border-sky-500/30 transition-colors">
          <div className="flex items-center gap-3 text-xs text-muted">
            <Building2 className="w-4 h-4" />
            <span>{department}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted">
            <Calendar className="w-4 h-4" />
            <span>Started {formatDateShort(dateStarted)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EmployeeCard;
