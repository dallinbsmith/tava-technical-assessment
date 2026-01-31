import { z } from "zod";

export const employeeCreateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email").or(z.literal("")).optional(),
  title: z.string().optional(),
  department: z.string().min(1, "Department is required"),
  dateStarted: z.string().optional(),
  quote: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  avatarUrl: z.string().optional(),
});

export const employeeUpdateSchema = employeeCreateSchema.partial();

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors
      .map((e) => e.path.join(".") + ": " + e.message)
      .join(", ");
    const error = new Error(errors);
    error.status = 400;
    throw error;
  }
  req.body = result.data;
  next();
};
