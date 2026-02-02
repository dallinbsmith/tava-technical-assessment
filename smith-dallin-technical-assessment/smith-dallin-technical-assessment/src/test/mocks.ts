// Mock employee data for tests
export const mockEmployee = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  title: "Software Engineer",
  department: "Engineering",
  dateStarted: "2024-01-15T00:00:00.000Z",
  quote: "Hello world!",
  status: "active" as const,
  avatarUrl: "https://example.com/avatar.jpg",
};

export const mockEmployees = [
  mockEmployee,
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    title: "Product Manager",
    department: "Product",
    dateStarted: "2023-06-01T00:00:00.000Z",
    quote: "Ship it!",
    status: "active" as const,
    avatarUrl: "",
  },
];

// Reference data for tests
export const mockReferenceData = {
  departments: ["Engineering", "Product", "Design"],
};
