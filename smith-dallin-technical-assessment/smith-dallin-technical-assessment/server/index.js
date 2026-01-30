import express from "express";
import cors from "cors";
import multer from "multer";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import {
  getAllEmployees,
  getEmployeeById,
  getDepartments,
  getSquads,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "./services/employeeService.js";
import {
  employeeCreateSchema,
  employeeUpdateSchema,
  validate,
} from "./schemas.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.resolve(__dirname, "uploads");
const PORT = process.env.PORT || 3001;

// File upload configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await mkdir(UPLOADS_DIR, { recursive: true });
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    cb(
      allowedTypes.includes(file.mimetype)
        ? null
        : new Error("Invalid file type"),
      allowedTypes.includes(file.mimetype),
    );
  },
});

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(UPLOADS_DIR));

// Employee routes
app.get("/employees", async (req, res) => {
  res.json(await getAllEmployees(req.query));
});

app.get("/employees/:id", async (req, res) => {
  res.json(await getEmployeeById(req.params.id));
});

app.post("/employees", validate(employeeCreateSchema), async (req, res) => {
  res.status(201).json(await createEmployee(req.body));
});

app.post("/employees/new", (req, res, next) => {
  req.url = "/employees";
  app.handle(req, res, next);
});

app.put("/employees/:id", validate(employeeUpdateSchema), async (req, res) => {
  res.json(await updateEmployee(req.params.id, req.body));
});

app.delete("/employees/:id", async (req, res) => {
  res.json(await deleteEmployee(req.params.id));
});

// Reference data routes
app.get("/departments", async (req, res) => {
  res.json(await getDepartments());
});

app.get("/squads", async (req, res) => {
  res.json(await getSquads());
});

// File upload route
app.post("/upload", upload.single("avatar"), (req, res) => {
  if (!req.file) {
    const error = new Error("No file uploaded");
    error.status = 400;
    throw error;
  }
  res.json({ url: `http://localhost:${PORT}/uploads/${req.file.filename}` });
});

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Error handlers
app.use((req, res) => res.status(404).json({ error: "Not found" }));

app.use((err, req, res, next) => {
  const status = err.status || 500;
  console.error(`${req.method} ${req.path} - ${status}: ${err.message}`);
  res.status(status).json({ error: err.message });
});

const server = app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
process.on("SIGTERM", () => server.close(() => process.exit(0)));
