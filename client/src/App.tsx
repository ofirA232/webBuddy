import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ProjectDetail from "@/pages/ProjectDetail";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WebDevelopment from './pages/WebDevelopment';

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/web-development" element={<WebDevelopment />} />
                <Route path="/project/:slug" element={<ProjectDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
