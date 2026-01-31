import { EmployeeHeaderProps } from "./utils/__types__";
import AvatarUpload from "./AvatarUpload";

const EmployeeHeader = ({ employee, onAvatarUpload }: EmployeeHeaderProps) => {
  const { firstName, lastName, title, status, avatarUrl } = employee;
  const isInactive = status === "inactive";

  return (
    <div className="bg-gradient-to-r from-sky-900/50 to-sky-800/30 p-8">
      <div className="flex items-center gap-6">
        <AvatarUpload
          currentAvatarUrl={avatarUrl}
          firstName={firstName}
          lastName={lastName}
          onUpload={onAvatarUpload}
          inactive={isInactive}
        />
        <div>
          <h1 className="text-2xl font-bold text-primary">
            {firstName} {lastName}
          </h1>
          <p className="text-lg text-muted mt-1">{title}</p>
          {isInactive && (
            <span className="text-sm text-subtle mt-2 block">
              (deactivated)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeHeader;
