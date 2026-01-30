import { Link } from "react-router-dom";
import { Building2, Calendar } from "lucide-react";
import { EmployeeCardProps } from "../__types__";
import Avatar from "./Avatar";

const EmployeeCard = ({ employee: emp }: EmployeeCardProps) => {
  const isInactive = emp.status === "inactive";

  return (
    <Link
      to={`/employees/${emp.id}`}
      className="card-interactive block p-5 group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-sky-900/0 to-sky-800/0 group-hover:from-sky-900/20 group-hover:to-sky-800/10 transition-all duration-300" />
      <div className="relative">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Avatar
              src={emp.avatarUrl}
              firstName={emp.firstName}
              lastName={emp.lastName}
              size="lg"
              inactive={isInactive}
              className="ring-2 ring-border group-hover:ring-sky-500/50 transition-all"
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-primary group-hover:text-sky-400 transition-colors truncate">
                {emp.firstName} {emp.lastName}
              </h3>
              <p className="text-sm text-muted truncate">{emp.title}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {isInactive ? (
                  <span className="text-xs text-subtle">(deactivated)</span>
                ) : (
                  emp.squads.map((squad) => (
                    <span key={squad} className="badge">
                      {squad}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2 pt-3 border-t border-border group-hover:border-sky-500/30 transition-colors">
          <div className="flex items-center gap-3 text-xs text-muted">
            <Building2 className="w-4 h-4" />
            <span>{emp.department}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted">
            <Calendar className="w-4 h-4" />
            <span>
              Started{" "}
              {new Date(emp.dateStarted).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EmployeeCard;
