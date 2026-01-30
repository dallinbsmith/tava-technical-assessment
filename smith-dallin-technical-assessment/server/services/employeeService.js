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

export const joinEmployeeSquads = ({ employees, squads, employeeSquads }) => {
  const squadNameById = squads.reduce(
    (acc, { id, name }) => ({ ...acc, [id]: name }),
    {},
  );

  const squadIdsByEmployeeId = employeeSquads.reduce(
    (acc, { employeeId, squadId }) => {
      (acc[employeeId] ??= []).push(squadId);
      return acc;
    },
    {},
  );

  return employees.map((employee) => ({
    ...employee,
    squads: (squadIdsByEmployeeId[employee.id] || []).map(
      (id) => squadNameById[id],
    ),
  }));
};

export const filterEmployees = (employees, { search, department, squad }) => {
  const searchQuery = search?.toLowerCase() || "";
  const departmentFilters = department?.split(",") || [];
  const squadFilters = squad?.split(",") || [];

  return employees.filter(
    ({ firstName, lastName, email, title, department, squads }) => {
      const matchesSearch =
        searchQuery === "" ||
        `${firstName} ${lastName}`.toLowerCase().includes(searchQuery) ||
        email?.toLowerCase().includes(searchQuery) ||
        title?.toLowerCase().includes(searchQuery) ||
        department?.toLowerCase().includes(searchQuery) ||
        squads?.some((s) => s.toLowerCase().includes(searchQuery));

      const matchesDepartment =
        departmentFilters.length === 0 ||
        departmentFilters.includes(department);

      const matchesSquad =
        squadFilters.length === 0 ||
        squads?.some((s) => squadFilters.includes(s));

      return matchesSearch && matchesDepartment && matchesSquad;
    },
  );
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
      default:
        comparison = 0;
    }

    return order === "desc" ? -comparison : comparison;
  });
};

export const paginateEmployees = (employees, { page, limit }) => {
  const total = employees.length;
  const p = parseInt(page, 10) || 1;
  const l = parseInt(limit, 10) || total;
  const paginated = employees.slice((p - 1) * l, p * l);

  return { data: paginated, total, page: p, limit: l };
};

export const getAllEmployees = async (query) => {
  const data = await readData();
  const employees = joinEmployeeSquads(data);
  const filtered = filterEmployees(employees, query);
  const sorted = sortEmployees(filtered, query);
  return paginateEmployees(sorted, query);
};

export const getEmployeeById = async (id) => {
  const parsedId = parseId(id);
  const data = await readData();
  const employees = joinEmployeeSquads(data);
  const employee = employees.find((emp) => emp.id === parsedId);
  if (!employee) {
    const error = new Error("Employee not found");
    error.status = 404;
    throw error;
  }
  return employee;
};

export const getDepartments = async () => {
  const data = await readData();
  const fromEmployees = data.employees
    .map((emp) => emp.department)
    .filter(Boolean);
  const stored = data.departments || [];
  return [...new Set([...stored, ...fromEmployees])].sort();
};

export const getSquads = async () => {
  const data = await readData();
  return data.squads.map((squad) => squad.name).sort();
};

export const createEmployee = async (employeeData) => {
  const data = await readData();
  const newId =
    data.employees.length > 0
      ? Math.max(...data.employees.map((emp) => emp.id)) + 1
      : 1;

  const newEmployee = {
    id: newId,
    firstName: employeeData.firstName.trim(),
    lastName: employeeData.lastName.trim(),
    email: employeeData.email?.trim() || "",
    title: employeeData.title?.trim() || "",
    department: employeeData.department.trim(),
    dateStarted: employeeData.dateStarted || new Date().toISOString(),
    quote: employeeData.quote?.trim() || "",
    status: employeeData.status || "active",
    avatarUrl: employeeData.avatarUrl || "",
  };

  data.employees.push(newEmployee);

  const requestedSquads = employeeData.squads || [];
  for (const squadName of requestedSquads) {
    const squad = data.squads.find((sq) => sq.name === squadName);
    if (squad) {
      data.employeeSquads.push({ employeeId: newId, squadId: squad.id });
    }
  }

  await writeData(data);
  return { ...newEmployee, squads: requestedSquads };
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

  const { squads: requestedSquads, ...employeeFields } = employeeData;
  data.employees[index] = {
    ...data.employees[index],
    ...employeeFields,
    id: parsedId,
  };

  if (requestedSquads !== undefined) {
    data.employeeSquads = data.employeeSquads.filter(
      (es) => es.employeeId !== parsedId,
    );

    for (const squadName of requestedSquads) {
      const squad = data.squads.find((sq) => sq.name === squadName);
      if (squad) {
        data.employeeSquads.push({ employeeId: parsedId, squadId: squad.id });
      }
    }
  }

  await writeData(data);

  const employees = joinEmployeeSquads(data);
  return employees.find((emp) => emp.id === parsedId);
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
  const squadIds = data.employeeSquads
    .filter((es) => es.employeeId === parsedId)
    .map((es) => es.squadId);
  const squadNames = data.squads
    .filter((sq) => squadIds.includes(sq.id))
    .map((sq) => sq.name);

  data.employeeSquads = data.employeeSquads.filter(
    (es) => es.employeeId !== parsedId,
  );

  await writeData(data);
  return { ...deletedEmployee, squads: squadNames };
};
