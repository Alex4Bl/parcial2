import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import "./index.css";
// import App from "./App.tsx";
import router from "./routes/router.tsx";
import { ToastProvider } from "./provider/ToastProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <BrowserRouter>
      <App />
    </BrowserRouter> */}
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  </StrictMode>
);
