import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AppNav } from "@/components/layout/AppNav";
import CustomerMenu from "./pages/CustomerMenu";
import POSBilling from "./pages/POSBilling";
import KitchenDisplay from "./pages/KitchenDisplay";
import AdminDashboard from "./pages/AdminDashboard";
import CashierLogin from "./pages/CashierLogin";
import CashierDashboard from "./pages/CashierDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const hiddenNavRoutes = ['/cashier', '/cashier-login'];
  const hideNav = hiddenNavRoutes.includes(location.pathname);

  return (
    <>
      {!hideNav && <AppNav />}
      <Routes>
        <Route path="/" element={<CustomerMenu />} />
        <Route path="/pos" element={<POSBilling />} />
        <Route path="/cashier-login" element={<CashierLogin />} />
        <Route path="/cashier" element={<CashierDashboard />} />
        <Route path="/kitchen" element={<KitchenDisplay />} />
        <Route path="/admin" element={<AdminDashboard />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
