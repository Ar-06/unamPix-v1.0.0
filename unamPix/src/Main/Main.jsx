import { Home } from "../Home/home";
import { Categorias } from "../Categorias/categorias";
import { Login } from "../loginRegister/login";
import { Register } from "../loginRegister/register";
import { Eventos } from "../eventos/eventos";
import { SubirImagen } from "../subirImagen/subirImagen";
import { PublicacionDetalle } from "../publicacionDetalle/publicacionDetalle";
import { CategoriaImage } from "../Categorias/categoriasImage";
import { DashboardEvents } from "../moderadorDashboard/dashboardEvents";
import { Dashboard } from "../moderadorDashboard/dashboard";
import { DashboardImages } from "../moderadorDashboard/dashboardImages";
import { LoginModerador } from "../moderadorLogin/moderadorLogin";
import { UserSection } from "../userSection/userSectionPage";
import { EditPublication } from "../userSection/ediPublication";
import { Route, Routes } from "react-router-dom";

export function Main() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/addImage" element={<SubirImagen />} />
        <Route
          path="/publicacion/:idPublicacion"
          element={<PublicacionDetalle />}
        />
        <Route path="/publicaciones/:categoria" element={<CategoriaImage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/events" element={<DashboardEvents />} />
        <Route path="/dashboard/images" element={<DashboardImages />} />
        <Route path="/loginMod" element={<LoginModerador />} />
        <Route path="/usuario/perfil" element={<UserSection />} />
        <Route path="/edit-publication/:idPublicacion" element={<EditPublication />} />
        <Route path="/loginMod" element={<LoginModerador />} />
      </Routes>
    </div>
  );
}
