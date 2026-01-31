import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.resolve(__dirname, "../../src/api/data.json");

export const readData = async () =>
  JSON.parse(await readFile(DATA_FILE, "utf-8"));

export const writeData = async (data) =>
  await writeFile(DATA_FILE, JSON.stringify(data, null, 2));

export const parseId = (id) => {
  const parsed = parseInt(id, 10);
  if (isNaN(parsed)) {
    const error = new Error("Invalid ID");
    error.status = 400;
    throw error;
  }
  return parsed;
};

export const filterEmployees = (employees, { search, department, status }) => {
  const searchQuery = search?.toLowerCase() || "";
  const departmentFilters = department?.split(",") || [];

  return employees.filter((employee) => {
    const { firstName, lastName, email, title, department } = employee;

    const matchesSearch =
      searchQuery === "" ||
      `${firstName} ${lastName}`.toLowerCase().includes(searchQuery) ||
      email?.toLowerCase().includes(searchQuery) ||
      title?.toLowerCase().includes(searchQuery) ||
      department?.toLowerCase().includes(searchQuery);

    const matchesDepartment =
      departmentFilters.length === 0 ||
      departmentFilters.includes(department);

    const matchesStatus = !status || employee.status === status;

    return matchesSearch && matchesDepartment && matchesStatus;
  });
};

export const sortEmployees = (employees, { sort, order }) => {
  return [...employees].sort((a, b) => {
    let comparison = 0;

    switch (sort) {
      case "firstName":
        comparison = `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`,
        );
        break;
      case "email":
        comparison = (a.email || "").localeCompare(b.email || "");
        break;
      case "department":
        comparison = (a.department || "").localeCompare(b.department || "");
        break;
      case "dateStarted":
        const dateA = a.dateStarted ? new Date(a.dateStarted).getTime() : 0;
        const dateB = b.dateStarted ? new Date(b.dateStarted).getTime() : 0;
        comparison = dateA - dateB;
        break;
      case "status":
        comparison = (a.status || "").localeCompare(b.status || "");
        break;
      case "lastName":
        comparison = (a.lastName || "").localeCompare(b.lastName || "");
        break;
      default:
        comparison = 0;
    }

    return order === "desc" ? -comparison : comparison;
  });
};

export const paginateEmployees = (employees, { page, limit }) => {
  const totalCount = employees.length;
  const currentPage = parseInt(page, 10) || 1;
  const pageSize = parseInt(limit, 10) || totalCount;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = currentPage * pageSize;
  const pageData = employees.slice(startIndex, endIndex);

  return { data: pageData, total: totalCount, page: currentPage, limit: pageSize };
};

export const getAllEmployees = async (query) => {
  const data = await readData();
  const filtered = filterEmployees(data.employees, query);
  const sorted = sortEmployees(filtered, query);
  return paginateEmployees(sorted, query);
};

export const getEmployeeById = async (id) => {
  const parsedId = parseId(id);
  const data = await readData();
  const employee = data.employees.find((emp) => emp.id === parsedId);
  if (!employee) {
    const error = new Error("Employee not found");
    error.status = 404;
    throw error;
  }
  return employee;
};

export const getDepartments = async () => {
  const data = await readData();
  const departments = data.employees.reduce((set, emp) => {
    if (emp.department) set.add(emp.department);
    return set;
  }, new Set(data.departments || []));

  return [...departments].sort();
};

export const createEmployee = async (employeeData) => {
  const {
    firstName,
    lastName,
    email = "",
    title = "",
    department,
    dateStarted = new Date().toISOString(),
    quote = "",
    status = "active",
    avatarUrl = "",
  } = employeeData;

  const data = await readData();
  const newId = Math.max(0, ...data.employees.map((e) => e.id)) + 1;

  const newEmployee = {
    id: newId,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    title: title.trim(),
    department: department.trim(),
    dateStarted,
    quote: quote.trim(),
    status,
    avatarUrl,
  };

  data.employees.push(newEmployee);
  await writeData(data);
  return newEmployee;
};

export const updateEmployee = async (id, employeeData) => {
  const parsedId = parseId(id);
  const data = await readData();
  const index = data.employees.findIndex((emp) => emp.id === parsedId);
  if (index === -1) {
    const error = new Error("Employee not found");
    error.status = 404;
    throw error;
  }

  data.employees[index] = {
    ...data.employees[index],
    ...employeeData,
    id: parsedId,
  };

  await writeData(data);
  return data.employees[index];
};

export const deleteEmployee = async (id) => {
  const parsedId = parseId(id);
  const data = await readData();
  const index = data.employees.findIndex((emp) => emp.id === parsedId);
  if (index === -1) {
    const error = new Error("Employee not found");
    error.status = 404;
    throw error;
  }

  const deletedEmployee = data.employees.splice(index, 1)[0];
  await writeData(data);
  return deletedEmployee;
};
