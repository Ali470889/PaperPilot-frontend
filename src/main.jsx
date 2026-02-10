import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "next-themes";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: Infinity,
      cacheTime: Infinity,
    },
    mutations: {
      retry: false,
    },
  },
});

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <App />
      </ThemeProvider>
    </BrowserRouter>
    <Toaster position="top-center" richColors expand={true} />
  </QueryClientProvider>
  // </StrictMode>,
);
