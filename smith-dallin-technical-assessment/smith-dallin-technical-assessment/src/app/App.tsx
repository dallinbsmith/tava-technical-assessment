import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Outlet,
} from "react-router-dom";
import tavaLogo from "@/assets/tava-logo.svg";
import EmployeeListPage from "@features/employees/list/EmployeeListPage";
import EmployeeDetailPage from "@features/employees/detail/EmployeeDetailPage";
import EmployeeFormPage from "@features/employees/form/EmployeeFormPage";
import ErrorBoundary from "@shared/components/ErrorBoundary";
import { getDepartments, getEmployee } from "@shared/lib/api";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const referenceDataLoader = async () => {
  const departments = await getDepartments();
  return { departments };
};

const editLoader = async ({ params }: { params: { id?: string } }) => {
  const [departments, employee] = await Promise.all([
    getDepartments(),
    getEmployee(parseInt(params.id!)),
  ]);
  return { departments, employee };
};

const Layout = () => (
  <div className="min-h-screen bg-base">
    <header className="sticky top-0 z-50 bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <img src={tavaLogo} className="h-8 w-auto" alt="Tava Health" />
            <div className="hidden sm:block h-6 w-px bg-border" />
            <div className="hidden sm:flex items-center gap-2 text-primary">
              <span className="font-semibold">Employee Management</span>
            </div>
          </Link>
          <a
            href="https://tavahealth.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted hover:text-sky-400 transition-colors"
          >
            tavahealth.com
          </a>
        </div>
      </div>
    </header>
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </main>
  </div>
);

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <EmployeeListPage />,
        loader: referenceDataLoader,
      },
      {
        path: "/employees/new",
        element: <EmployeeFormPage />,
        loader: referenceDataLoader,
      },
      { path: "/employees/:id", element: <EmployeeDetailPage /> },
      {
        path: "/employees/:id/edit",
        element: <EmployeeFormPage />,
        loader: editLoader,
      },
    ],
  },
]);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);

export default App;
