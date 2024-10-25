import { ThemeProvider } from "@/components/ui/theme-provider.tsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./routes";
import { BrowserRouter } from "react-router-dom";


const client = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

function App() {
    return (
      <QueryClientProvider client={client}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <BrowserRouter>{router}</BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    );
}

export default App;