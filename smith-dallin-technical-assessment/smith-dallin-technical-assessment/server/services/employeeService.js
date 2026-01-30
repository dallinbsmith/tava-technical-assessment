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

export const filterEmployees = (employees, { search, department, squad, status }) => {
  const searchQuery = search?.toLowerCase() || "";
  const departmentFilters = department?.split(",") || [];
  const squadFilters = squad?.split(",") || [];

  return employees.filter(
    (employee) => {
      const { firstName, lastName, email, title, department, squads } = employee;

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

      const matchesStatus =
        !status || employee.status === status;

      return matchesSearch && matchesDepartment && matchesSquad && matchesStatus;
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
  const departments = data.employees.reduce((set, emp) => {
    if (emp.department) set.add(emp.department);
    return set;
  }, new Set(data.departments || []));

  return [...departments].sort();
};

export const getSquads = async () => {
  const data = await readData();
  return data.squads.map((squad) => squad.name).sort();
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
    squads: requestedSquads = [],
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

  const squadIdByName = Object.fromEntries(
    data.squads.map(({ id, name }) => [name, id])
  );
  requestedSquads.reduce((links, name) => {
    if (squadIdByName[name]) {
      links.push({ employeeId: newId, squadId: squadIdByName[name] });
    }
    return links;
  }, data.employeeSquads);

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

    const squadIdByName = Object.fromEntries(
      data.squads.map(({ id, name }) => [name, id])
    );
    requestedSquads.reduce((links, name) => {
      if (squadIdByName[name]) {
        links.push({ employeeId: parsedId, squadId: squadIdByName[name] });
      }
      return links;
    }, data.employeeSquads);
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

  const squadNameById = Object.fromEntries(
    data.squads.map(({ id, name }) => [id, name])
  );

  const { squadNames, remainingLinks } = data.employeeSquads.reduce(
    (acc, es) => {
      es.employeeId === parsedId
        ? acc.squadNames.push(squadNameById[es.squadId])
        : acc.remainingLinks.push(es);
      return acc;
    },
    { squadNames: [], remainingLinks: [] }
  );

  data.employeeSquads = remainingLinks;

  await writeData(data);
  return { ...deletedEmployee, squads: squadNames };
};
