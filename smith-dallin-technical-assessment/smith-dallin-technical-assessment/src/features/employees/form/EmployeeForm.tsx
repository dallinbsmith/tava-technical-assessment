import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { EmployeeFormProps } from "./utils/__types__";
import { employeeFormSchema, EmployeeFormData } from "../utils/__types__";
import { cn } from "@shared/lib/styles";
import {
  FormRow,
  FormField,
  FormInput,
  FormTextArea,
} from "@shared/components/FormFields";

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
  } = {},
  onSubmit,
  submitLabel,
  title,
  departments,
}: EmployeeFormProps) => {
  const [formData, setFormData] = useState({
    firstName,
    lastName,
    email,
    title: jobTitle,
    department,
    dateStarted: dateStarted.split("T")[0],
    quote,
    status,
    avatarUrl,
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

  const handleFieldChange =
    (field: keyof EmployeeFormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));
    };

  const handleStatusChange = (newStatus: "active" | "inactive") => {
    setFormData((prev) => ({ ...prev, status: newStatus }));
  };

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
        <FormRow>
          <FormField
            label="First Name"
            required
            htmlFor="firstName"
            error={errors.firstName}
          >
            <FormInput
              id="firstName"
              value={formData.firstName}
              onChange={handleFieldChange("firstName")}
              error={!!errors.firstName}
            />
          </FormField>
          <FormField
            label="Last Name"
            required
            htmlFor="lastName"
            error={errors.lastName}
          >
            <FormInput
              id="lastName"
              value={formData.lastName}
              onChange={handleFieldChange("lastName")}
              error={!!errors.lastName}
            />
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label="Email" htmlFor="email" error={errors.email}>
            <FormInput
              id="email"
              type="email"
              value={formData.email}
              onChange={handleFieldChange("email")}
              error={!!errors.email}
              placeholder="email@example.com"
            />
          </FormField>
          <FormField label="Job Title" htmlFor="jobTitle">
            <FormInput
              id="jobTitle"
              value={formData.title}
              onChange={handleFieldChange("title")}
              placeholder="e.g. Software Engineer"
            />
          </FormField>
        </FormRow>

        <FormRow>
          <FormField
            label="Start Date"
            required
            htmlFor="dateStarted"
            error={errors.dateStarted}
          >
            <FormInput
              id="dateStarted"
              type="date"
              value={formData.dateStarted}
              onChange={handleFieldChange("dateStarted")}
              error={!!errors.dateStarted}
            />
          </FormField>
          <FormField label="Status">
            <div className="flex gap-2">
              {(["active", "inactive"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleStatusChange(s)}
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
          </FormField>
        </FormRow>

        <FormField
          label="Department"
          required
          htmlFor="department"
          error={errors.department}
        >
          <select
            id="department"
            value={formData.department}
            onChange={handleFieldChange("department")}
            className={cn("input-field", errors.department && "error")}
          >
            <option value="">Select a department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Quote" htmlFor="quote">
          <FormTextArea
            id="quote"
            value={formData.quote}
            onChange={handleFieldChange("quote")}
            rows={3}
            placeholder="A memorable quote..."
          />
        </FormField>

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
    </div>
  );
};

export default EmployeeForm;
