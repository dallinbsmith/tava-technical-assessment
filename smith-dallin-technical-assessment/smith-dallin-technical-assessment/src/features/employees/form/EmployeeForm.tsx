import {
  useState,
  FormEvent,
  ReactNode,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertCircle, Pencil } from "lucide-react";
import { Employee, EmployeeFormData, employeeFormSchema } from "../__types__";
import { cn } from "../../../shared/lib/styles";
import AssignmentModal from "./AssignmentModal";

// Form field components
const Row = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4", className)}>
    {children}
  </div>
);

const Field = ({
  label,
  required,
  error,
  children,
  htmlFor,
  action,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  htmlFor?: string;
  action?: ReactNode;
}) => (
  <div>
    <div
      className={cn(
        "flex items-center mb-1.5",
        action ? "justify-between" : "",
      )}
    >
      <label htmlFor={htmlFor} className="block text-sm font-medium text-muted">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {action}
    </div>
    {children}
    {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
  </div>
);

const Input = ({
  error,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) => (
  <input
    className={cn("input-field", error && "error", className)}
    {...props}
  />
);

const TextArea = ({
  error,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }) => (
  <textarea
    className={cn("input-field resize-none", error && "error", className)}
    {...props}
  />
);

type Props = {
  initialData?: Partial<Employee>;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  submitLabel: string;
  title: string;
  departments: string[];
  squads: string[];
};

const EmployeeForm = ({
  initialData: {
    firstName = "",
    lastName = "",
    email = "",
    title: jobTitle = "",
    department = "",
    dateStarted = "",
    quote = "",
    status = "active",
    avatarUrl = "",
    squads: initialSquads = [],
  } = {},
  onSubmit,
  submitLabel,
  title,
  departments,
  squads,
}: Props) => {
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName,
    lastName,
    email,
    title: jobTitle,
    department,
    dateStarted: dateStarted.split("T")[0],
    quote,
    status,
    avatarUrl,
    squads: initialSquads,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = () => {
    const result = employeeFormSchema.safeParse(formData);
    if (result.success) {
      setErrors({});
      return true;
    }
    const e: Record<string, string> = {};
    result.error.errors.forEach((err) => {
      const field = err.path[0] as string;
      e[field] ??= err.message;
    });
    setErrors(e);
    return false;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;
    try {
      setSubmitting(true);
      await onSubmit({
        ...formData,
        dateStarted: new Date(formData.dateStarted).toISOString(),
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const set =
    (field: keyof EmployeeFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const editBtn = (
    <button
      type="button"
      onClick={() => setIsAssignmentModalOpen(true)}
      className="p-1 text-muted hover:text-sky-400 transition-colors"
    >
      <Pencil className="w-4 h-4" />
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300"
        >
          <ArrowLeft className="w-4 h-4" /> Back to list
        </Link>
        <h1 className="text-2xl font-bold text-primary mt-4">{title}</h1>
      </div>

      {submitError && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-500/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <Row>
          <Field
            label="First Name"
            required
            htmlFor="firstName"
            error={errors.firstName}
          >
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={set("firstName")}
              error={!!errors.firstName}
            />
          </Field>
          <Field
            label="Last Name"
            required
            htmlFor="lastName"
            error={errors.lastName}
          >
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={set("lastName")}
              error={!!errors.lastName}
            />
          </Field>
        </Row>

        <Row>
          <Field label="Email" htmlFor="email" error={errors.email}>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={set("email")}
              error={!!errors.email}
              placeholder="email@example.com"
            />
          </Field>
          <Field label="Job Title" htmlFor="jobTitle">
            <Input
              id="jobTitle"
              value={formData.title}
              onChange={set("title")}
              placeholder="e.g. Software Engineer"
            />
          </Field>
        </Row>

        <Row>
          <Field
            label="Start Date"
            required
            htmlFor="dateStarted"
            error={errors.dateStarted}
          >
            <Input
              id="dateStarted"
              type="date"
              value={formData.dateStarted}
              onChange={set("dateStarted")}
              error={!!errors.dateStarted}
            />
          </Field>
          <Field label="Status">
            <div className="flex gap-2">
              {(["active", "inactive"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, status: s }))
                  }
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium transition-colors capitalize",
                    formData.status === s
                      ? s === "active"
                        ? "bg-green-900/40 text-green-300 border border-green-700/50"
                        : "bg-red-900/30 text-red-300 border border-red-700/40"
                      : "bg-elevated text-muted hover:bg-muted border border-transparent",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </Field>
        </Row>

        <Row>
          <Field
            label="Department"
            required
            error={errors.department}
            action={editBtn}
          >
            <span
              className={
                formData.department ? "text-primary" : "text-sm text-subtle"
              }
            >
              {formData.department || "No department"}
            </span>
          </Field>
          <Field label="Squads" action={editBtn}>
            <div className="flex items-center gap-1 flex-wrap">
              {formData.squads.length > 0 ? (
                formData.squads.map((sq) => (
                  <span key={sq} className="badge">
                    {sq}
                  </span>
                ))
              ) : (
                <span className="text-sm text-subtle">No squads</span>
              )}
            </div>
          </Field>
        </Row>

        <Field label="Quote" htmlFor="quote">
          <TextArea
            id="quote"
            value={formData.quote}
            onChange={set("quote")}
            rows={3}
            placeholder="A memorable quote..."
          />
        </Field>

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-border">
          <Link
            to="/"
            className="btn btn-secondary flex-1 sm:flex-none justify-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-primary flex-1 sm:flex-none justify-center"
            disabled={submitting}
          >
            {submitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </form>

      <AssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        departments={departments}
        squads={squads}
        selectedDepartment={formData.department}
        selectedSquads={formData.squads}
        onSave={(dept, sqs) => {
          setFormData((prev) => ({ ...prev, department: dept, squads: sqs }));
          if (errors.department)
            setErrors((prev) => ({ ...prev, department: "" }));
        }}
      />
    </div>
  );
};

export default EmployeeForm;
