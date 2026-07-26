import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <AppRoutes />
          <ToastContainer position="top-right" autoClose={3000} />
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
