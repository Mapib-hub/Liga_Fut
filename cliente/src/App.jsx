// c:\Users\Acer\Desktop\proyectos\prueba_node\cliente\src\App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// --- Importaciones Públicas ---
import HomePage from './pages/HomePage'; import PublicLayout from "./components/public/PublicLayout.jsx";
import EquiposWebPage from './pages/EquiposWebPage'; // 
import GoleadoresPage from './pages/GoleadoresPage'; 
import EquipoDetallePage from './pages/EquipoDetallePage';
import JugadorDetallePage from './pages/JugadorDetallePage';
import TablaPosicionesPage from './pages/TablaPosicionesPage';
import NoticiasListPage from './pages/NoticiasListPage';
import NoticiaDetallePage from './pages/NoticiaDetallePage';

import LoginPage from "./pages/LoginPage";
import ImagenPage from "./pages/ImagenPage"; // ¿Es pública o admin? La dejo aquí por ahora.

// --- Importaciones Admin ---
import RegisterPage from "./pages/admin/RegisterPage"; // ¿Debería ser pública?
import TasksPage from "./pages/admin/TasksPage";
import TaskFormPage from "./pages/admin/TaskFormPage";
import ProfilePage from "./pages/admin/ProfilePage.jsx";
import EquiposPage from "./pages/admin/EquiposPage";
import CalendarioPage from "./pages/admin/CalendarioPage.jsx";
import FechasPage from "./pages/admin/FechasPage";
import NoticiasPage from "./pages/admin/NoticiasPage.jsx"; // Solo una importación
import JugadoresPage from "./pages/admin/JugadoresPage.jsx";
import GolesPage from "./pages/admin/GolesPage.jsx";
import DashboardPage from "./pages/admin/DashboardPage";
import AlertManagementPage from "./pages/admin/AlertManagementPage";

// --- Layouts y Protección ---
import ProtectedRoute from "./ProtectedRoute";
import ProtectedLayout from "./components/ProtectedLayout";

// --- Contextos ---
//import { TaskProvider } from "./context/TasksContext";
import { NotiProvider } from "./context/NotisContext";
import { EquiposProvider } from "./context/EquiposContext";
import { CalendarProvider } from "./context/CalendarioContext.jsx"; // Renombrado para claridad
import { FechasProvider } from "./context/FechaContext";
import { JugaProvider } from "./context/JugadorContext";
import { AlertProvider } from "./context/AlertContext.jsx";
import { PublicProvider } from "./context/PublicContex.jsx";
function App() {
  // Verificar si CalendarProvider y CalenProvider son lo mismo
  // Si son lo mismo, usa solo uno. Si son diferentes, asegúrate que ambos sean necesarios.
  // Asumiré que son lo mismo y usaré CalendarProvider.

  return (
    <AuthProvider>
      <AlertProvider>
        <NotiProvider>
          <EquiposProvider>
            <CalendarProvider> 
              <FechasProvider>
                <JugaProvider>
                  <PublicProvider>
                  {/* <CalenProvider> Si es diferente, descomenta y envuelve aquí </CalenProvider> */}
                  <BrowserRouter>
                    <Routes>
                      <Route path="/login" element={<LoginPage />} />
                      {/* --- RUTAS PÚBLICAS --- */}
                      <Route element={<PublicLayout />}> {/* <-- Ruta Padre para Layout Público */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/web/equipos" element={<EquiposWebPage />} />
                      <Route path="/web/equipos/:id" element={<EquipoDetallePage />} />
                      <Route path="/web/goleadores" element={<GoleadoresPage />} />
                      <Route path="/web/jugadores/:id" element={<JugadorDetallePage />} />
                      <Route path="/web/tabla" element={<TablaPosicionesPage />} />
                      <Route path="/web/noticias" element={<NoticiasListPage />} />
                      <Route path="/web/noticias/:id" element={<NoticiaDetallePage />} />
                      
                      <Route path="/imagenes" element={<ImagenPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      </Route>
                      {/* --- Rutas Protegidas (Admin) --- */}
                      <Route element={<ProtectedRoute />}>
                        <Route element={<ProtectedLayout />}>
                          <Route path="/admin" element={<DashboardPage />} />
                          <Route path="/admin/alert" element={<AlertManagementPage />} />
                          <Route path="/admin/noticias" element={<NoticiasPage />} /> {/* Ruta única */}
                          <Route path="/tasks" element={<TasksPage />} /> {/* ¿Debería ser /admin/tasks? */}
                          <Route path="/add-tasks" element={<TaskFormPage />} /> {/* ¿Debería ser /admin/add-task? */}
                          <Route path="/tasks/:id" element={<TaskFormPage />} /> {/* ¿Debería ser /admin/tasks/:id? */}
                          <Route path="/profile" element={<ProfilePage />} /> {/* ¿Debería ser /admin/profile? */}

                          <Route path="/admin/fechas" element={<FechasPage />} />
                          {/* CORREGIDO: Ruta para que coincida con Sidebar */}
                          <Route path="/admin/fixture" element={<CalendarioPage />} />
                          <Route path="/admin/jugadores" element={<JugadoresPage />} />
                          <Route path="/admin/goles" element={<GolesPage />} />
                          <Route path="/admin/equipos" element={<EquiposPage />} />
                          {/* Eliminadas rutas duplicadas de equipos */}
                          {/* <Route path="/admin/add-equipo" element={<EquiposPage />} /> */}
                          {/* <Route path="/admin/equipos/:id" element={<EquiposPage />} /> */}
                          {/* Si necesitas una ruta específica para editar/añadir equipo, debería apuntar a un componente de formulario */}

                        </Route>
                      </Route>
                    </Routes>
                  </BrowserRouter>
                   </PublicProvider>
                </JugaProvider>
              </FechasProvider>
            </CalendarProvider>
          </EquiposProvider>
        </NotiProvider>
      </AlertProvider>
    </AuthProvider>
  );
}
export default App;
