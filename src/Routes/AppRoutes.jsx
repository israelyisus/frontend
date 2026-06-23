import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CrudAdmin } from "../componentes/CrudAdmin.jsx";
import { PageInicio } from "../componentes/CrudAdmin/PageInicio.jsx";
import { PageVentas } from "../componentes/CrudAdmin/PageVentas.jsx";
import { PageUsuarios } from "../componentes/CrudAdmin/PageUsuarios.jsx";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CrudAdmin />}>
          <Route index element={<PageInicio />} />
          <Route path="ventas" element={<PageVentas />} />
          <Route path="usuarios" element={<PageUsuarios />} />
        </Route>
      </Routes>
    </Router>
  );
};
export default AppRoutes;