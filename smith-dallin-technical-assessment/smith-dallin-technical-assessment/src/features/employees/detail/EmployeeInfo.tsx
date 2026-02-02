import { Mail, Building2, Calendar } from "lucide-react";
import { EmployeeInfoProps } from "../__types__";

const formatDateLong = (dateString?: string) =>
  dateString
    ? new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Not specified";

const InfoItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 bg-elevated flex items-center justify-center">
      <Icon className="w-5 h-5 text-muted" />
    </div>
    <div>
      <p className="text-sm text-muted">{label}</p>
      <p className="font-medium text-primary">{value}</p>
    </div>
  </div>
);

const EmployeeInfo = ({ employee }: EmployeeInfoProps) => {
  const { id, email, department, quote, dateStarted } = employee;

  return (
    <div className="p-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-medium text-muted uppercase tracking-wide mb-3">
              Contact Information
            </h2>
            <InfoItem icon={Mail} label="Email" value={email} />
          </div>

          <div>
            <h2 className="text-sm font-medium text-muted uppercase tracking-wide mb-3">
              Work Information
            </h2>
            <div className="flex items-center gap-3 text-sm text-muted">
              <Building2 className="w-4 h-4" />
              <span>{department || "Not assigned"}</span>
            </div>
          </div>

          {quote && <p className="text-muted italic">"{quote}"</p>}
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-medium text-muted uppercase tracking-wide mb-3">
              Employment Details
            </h2>
            <InfoItem
              icon={Calendar}
              label="Start Date"
              value={formatDateLong(dateStarted)}
            />
          </div>

          <div>
            <h2 className="text-sm font-medium text-muted uppercase tracking-wide mb-3">
              Employee Information
            </h2>
            <div className="bg-elevated p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted">Employee ID</span>
                <span className="text-sm font-mono text-primary">{id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeInfo;
