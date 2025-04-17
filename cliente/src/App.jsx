// c:\Users\Acer\Desktop\proyectos\prueba_node\cliente\src\App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import RegisterPage from "./pages/admin/RegisterPage";
import LoginPage from "./pages/LoginPage";
import TasksPage from "./pages/admin/TasksPage";
import NotisPage from "./pages/admin/NotisPage";
import TaskFormPage from "./pages/admin/TaskFormPage";
import ProfilePage from "./pages/admin/ProfilePage";
import HomePage from "./pages/HomePage";
import ImagenPage from "./pages/ImagenPage";

import ProtectedRoute from "./ProtectedRoute";
import { TaskProvider } from "./context/TasksContext";
import { NotiProvider } from "./context/NotisContext";

import ProtectedLayout from "./components/ProtectedLayout"; // Importa el nuevo layout
import { EquiposProvider } from "./context/EquiposContext"; // Importaremos esto más tarde
import EquiposPage from "./pages/admin/EquiposPage"; // Importaremos esto más tarde
//import EquipoFormPage from "./pages/admin/EquipoFormPage"; // Importaremos esto más tarde

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
      <NotiProvider>
      {/* Envolvemos las rutas que necesitan acceso a equipos con el Provider */}
      <EquiposProvider>
        <BrowserRouter>
            <Routes>
              {/* --- Rutas Públicas --- */}
              <Route path="/" element={<HomePage />} />
              <Route path="/imagenes" element={<ImagenPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* --- Rutas Protegidas --- */}
              <Route element={<ProtectedRoute />}>
                <Route element={<ProtectedLayout />}>
                  {/* Páginas existentes */}
                  <Route path="/admin/noticias" element={<NotisPage />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/add-tasks" element={<TaskFormPage />} />
                  <Route path="/tasks/:id" element={<TaskFormPage />} />
                  <Route path="/profile" element={<ProfilePage />} />

                  {/* --- NUEVAS RUTAS PARA EQUIPOS --- */}
                  <Route path="/admin/equipos" element={<EquiposPage />} />
                 /* <Route path="/admin/add-equipo" element={<EquiposPage />} />
                  <Route path="/admin/equipos/:id" element={<EquiposPage />} />
                  {/* --- FIN NUEVAS RUTAS --- */}

                </Route>
              </Route>
            </Routes>
        </BrowserRouter>
      </EquiposProvider>
      </NotiProvider>
      </TaskProvider>
    </AuthProvider>
  );
}
export default App;
