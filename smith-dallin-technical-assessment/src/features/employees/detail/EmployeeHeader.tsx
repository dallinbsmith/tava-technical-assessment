import { EmployeeHeaderProps } from "../__types__";
import AvatarUpload from "./AvatarUpload";

const EmployeeHeader = ({ employee, onAvatarUpload }: EmployeeHeaderProps) => {
  const isInactive = employee.status === "inactive";

  return (
    <div className="bg-gradient-to-r from-sky-900/50 to-sky-800/30 p-8">
      <div className="flex items-center gap-6">
        <AvatarUpload
          currentAvatarUrl={employee.avatarUrl}
          firstName={employee.firstName}
          lastName={employee.lastName}
          onUpload={onAvatarUpload}
          inactive={isInactive}
        />
        <div>
          <h1 className="text-2xl font-bold text-primary">
            {employee.firstName} {employee.lastName}
          </h1>
          <p className="text-lg text-muted mt-1">{employee.title}</p>
          <div className="flex flex-wrap gap-1 mt-3">
            {isInactive ? (
              <span className="text-sm text-subtle">(deactivated)</span>
            ) : (
              employee.squads?.map((squad) => (
                <span key={squad} className="badge">
                  {squad}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeHeader;
