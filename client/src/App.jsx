import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Notices from "./pages/Notices.jsx";
import Events from "./pages/Events.jsx";
import LocationPg from "./pages/Location.jsx";
import Contacts from "./pages/Contacts.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { AuthProvider, useAuth } from "./contexts/Auth.jsx";

// Membros
import MembersList from "./pages/Members/MembersList.jsx";
import MemberForm from "./pages/Members/MemberForm.jsx";
import MemberView from "./pages/Members/MemberView.jsx";

function RequireAuth({ children, roles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (roles?.length && !roles.includes(user.role)) {
    // usuário logado porém sem permissão -> manda para home (ou 403)
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/avisos" element={<Notices />} />
          <Route path="/eventos" element={<Events />} />
          <Route path="/localizacao" element={<LocationPg />} />
          <Route path="/contatos" element={<Contacts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />

          {/* Rotas protegidas */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth roles={["admin", "volunteer"]}>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/membros"
            element={
              <RequireAuth roles={["admin"]}>
                <MembersList />
              </RequireAuth>
            }
          />
          <Route
            path="/membros/novo"
            element={
              <RequireAuth roles={["admin"]}>
                <MemberForm />
              </RequireAuth>
            }
          />
          <Route
            path="/membros/:id"
            element={
              <RequireAuth roles={["admin"]}>
                <MemberView />
              </RequireAuth>
            }
          />

          {/* 404 */}
          <Route path="*" element={<div className="p-6">Página não encontrada</div>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
