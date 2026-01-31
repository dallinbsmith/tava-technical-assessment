import { ReactNode } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

// Reusable QueryClient for tests
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

// Wrapper factory for components that need QueryClient only (no router)
export const createQueryWrapper = () => {
  const queryClient = createTestQueryClient();
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

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

type WrapperProps = {
  children: ReactNode;
};

const AllTheProviders = ({ children }: WrapperProps) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
