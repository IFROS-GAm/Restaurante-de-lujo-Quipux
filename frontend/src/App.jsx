import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import { AuthProvider } from './context/AuthContext';
// Layouts de paneles
import UsuarioLayout from './layouts/UsuarioLayout';
import AdminLayout from './layouts/AdminLayout';
import RequireAdmin from './components/auth/RequireAdmin';
// Páginas Usuario
import MenuPage from './pages/MenuPage';
import EspecialesPage from './pages/usuario/EspecialesPage';
import SedesPage from './pages/usuario/SedesPage';
import ReservaGuiadaPage from './pages/usuario/ReservaGuiadaPage';
import PerfilPage from './pages/usuario/PerfilPage';
// Páginas Admin
import DashboardAdmin from './pages/admin/DashboardAdmin';
import ReservasAdmin from './pages/admin/ReservasAdmin';
import CalendarioAdmin from './pages/admin/CalendarioAdmin';
import SedesAdmin from './pages/admin/SedesAdmin';
import MesasAdmin from './pages/admin/MesasAdmin';
import MenuAdmin from './pages/admin/MenuAdmin';
import CategoriasAdmin from './pages/admin/CategoriasAdmin';
import PlatosAdmin from './pages/admin/PlatosAdmin';
// Páginas existentes (compatibilidad)
import MesasPage from './pages/MesasPage';
import ReservasPage from './pages/ReservasPage';
import ClientesPage from './pages/ClientesPage';
// Auth
import AuthPage from './pages/auth/AuthPage';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="container">
          <Routes>
          {/* Landing principal */}
          <Route path="/" element={<LandingPage />} />

            {/* Panel Usuario con rutas anidadas */}
            <Route path="/usuario" element={<UsuarioLayout />}>
              <Route path="menu" element={<MenuPage />} />
              <Route path="especiales" element={<EspecialesPage />} />
              <Route path="sedes" element={<SedesPage />} />
              <Route path="reserva" element={<ReservaGuiadaPage />} />
              <Route path="perfil" element={<PerfilPage />} />
            </Route>

            {/* Panel Admin con rutas anidadas, protegido por rol admin */}
            <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
              <Route path="dashboard" element={<DashboardAdmin />} />
              <Route path="reservas" element={<ReservasAdmin />} />
              <Route path="calendario" element={<CalendarioAdmin />} />
              <Route path="sedes" element={<SedesAdmin />} />
              <Route path="mesas" element={<MesasAdmin />} />
              <Route path="menu" element={<MenuAdmin />} />
              <Route path="menu/categorias" element={<CategoriasAdmin />} />
              <Route path="menu/platos" element={<PlatosAdmin />} />
          </Route>

          {/* Autenticación única */}
          <Route path="/auth" element={<AuthPage />} />
          {/* Compatibilidad: redirecciones */}
          <Route path="/auth/login" element={<Navigate to="/auth" replace />} />
          <Route path="/auth/register" element={<Navigate to="/auth" replace />} />

            {/* Rutas existentes por compatibilidad directa */}
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/reservas" element={<ReservasPage />} />
            <Route path="/mesas" element={<MesasPage />} />
            <Route path="/clientes" element={<ClientesPage />} />

            <Route path="*" element={<div className="page"><h2>404</h2><p>Página no encontrada</p></div>} />
          </Routes>
          </main>
        <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;