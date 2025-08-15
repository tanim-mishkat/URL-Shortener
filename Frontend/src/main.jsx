import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routing/routeTree.js";
import store from "./store/store.js";
import { Provider } from "react-redux";

const queryClient = new QueryClient();
const router = createRouter({
  routeTree,
  context: { queryClient, store },
});

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </Provider>
);
