import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ProjectDetail from "@/pages/ProjectDetail";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PageTransitions } from "@/lib/pageTransitions";
import { IntroScreen } from "@/components/IntroScreen";

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <IntroScreen />
      <Router>
        <PageTransitions />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              {/* The old standalone services page; its content now lives in the services section. */}
              <Route path="/web-development" element={<Navigate to="/#skills" replace />} />
              <Route path="/project/:slug" element={<ProjectDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
