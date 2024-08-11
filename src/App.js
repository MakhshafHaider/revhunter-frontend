import { Box } from "@chakra-ui/react";
import SidebarWithHeader from "./components/Sidebar";
import Enrichment from "./components/Enrichment";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Job from "./components/Job";
import ProtectedRoute from "./config/ProtectedRoute";
import { useSelector } from "react-redux";
import EmailSetup from "./components/EmailSetup";
function App() {
  const isLoggedIn = useSelector((state) => state.auth.id);

  return (
    <Box>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <SidebarWithHeader />
            </ProtectedRoute>
          }
        >
          <Route
            path=""
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Enrichment />
              </ProtectedRoute>
            }
          />
          <Route
            path="jobs"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Job />
              </ProtectedRoute>
            }
          />
          <Route
            path="clients"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <div>Clients</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="email-setup"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <EmailSetup />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Box>
  );
}

export default App;
