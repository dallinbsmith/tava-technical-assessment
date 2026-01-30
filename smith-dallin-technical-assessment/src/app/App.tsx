import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import EmployeeListPage from "../features/employees/list/EmployeeListPage";
import EmployeeDetailPage from "../features/employees/detail/EmployeeDetailPage";
import EmployeeCreatePage from "../features/employees/form/EmployeeCreatePage";
import EmployeeEditPage from "../features/employees/form/EmployeeEditPage";
import {
  getDepartments,
  getSquads,
  getEmployee,
} from "../features/employees/api/api";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const referenceDataLoader = async () => {
  const [departments, squads] = await Promise.all([
    getDepartments(),
    getSquads(),
  ]);
  return { departments, squads };
};

const editLoader = async ({ params }: { params: { id?: string } }) => {
  const [departments, squads, employee] = await Promise.all([
    getDepartments(),
    getSquads(),
    getEmployee(parseInt(params.id!)),
  ]);
  return { departments, squads, employee };
};

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
        element: <EmployeeCreatePage />,
        loader: referenceDataLoader,
      },
      { path: "/employees/:id", element: <EmployeeDetailPage /> },
      {
        path: "/employees/:id/edit",
        element: <EmployeeEditPage />,
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
