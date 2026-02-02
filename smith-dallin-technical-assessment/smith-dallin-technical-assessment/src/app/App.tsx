import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Outlet,
  useRouteError,
} from "react-router-dom";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import tavaLogo from "@/assets/tava-logo.svg";
import EmployeeListPage from "@features/employees/list/EmployeeListPage";
import EmployeeDetailPage from "@features/employees/detail/EmployeeDetailPage";
import EmployeeFormPage from "@features/employees/form/EmployeeFormPage";
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

const ErrorPage = () => {
  const error = useRouteError() as Error;

  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="card p-8 text-center max-w-md">
        <div className="w-16 h-16 bg-red-900/50 flex items-center justify-center mx-auto mb-4 rounded-full">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-semibold text-primary mb-2">
          Something went wrong
        </h2>
        <p className="text-muted mb-4">
          {error?.message || "An unexpected error occurred"}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-sky-900/40 text-sky-300 border border-sky-700/50 hover:bg-sky-800/50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted hover:text-primary transition-colors"
          >
            <Home className="w-4 h-4" />
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
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
      <Outlet />
    </main>
  </div>
);

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
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
