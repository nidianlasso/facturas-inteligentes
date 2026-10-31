import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/style.css";
import './App.css';
import Factura from "./components/Factura";
import EditarFactura from "./pages/EditarFactura";
import Resumen from "./pages/Resumen";


function App() {
 return(<BrowserRouter>
      <Routes>
        <Route path="/" element={<Factura />} />
        <Route path="/facturas/:id/editar" element={<EditarFactura />} />
        <Route path="/facturas/reportes/resumen" element={<Resumen />} />
      </Routes>
  </BrowserRouter>)
}

export default App
