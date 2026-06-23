import { useState, useEffect } from "react";
import axios from "axios";
import { API_VENTAS } from "../../config/api";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { Modal } from "./Modal";

// Formulario para crear/editar una venta
const FormVenta = ({ venta, onClose, onGuardado }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: venta || { direccionCompra: "", valorCompra: "", fechaCompra: "", despachoGenerado: false }
  });

  const onSubmit = async (data) => {
    const payload = {
      direccionCompra: data.direccionCompra,
      valorCompra: Number(data.valorCompra),
      fechaCompra: data.fechaCompra,
      despachoGenerado: false,
    };

    try {
      if (venta) {
        await axios.put(`${API_VENTAS}/api/v1/ventas/${venta.idVenta}`, payload, {
          headers: { "Content-Type": "application/json" }
        });
        Swal.fire({ title: "Venta actualizada ✅", icon: "success", confirmButtonColor: "#0d9488" });
      } else {
        await axios.post(`${API_VENTAS}/api/v1/ventas`, payload, {
          headers: { "Content-Type": "application/json" }
        });
        Swal.fire({ title: "Venta creada ✅", icon: "success", confirmButtonColor: "#0d9488" });
      }
      onGuardado();
      onClose();
    } catch (error) {
      console.error(error);
      Swal.fire({ title: "Error", text: "No se pudo guardar la venta", icon: "error", confirmButtonColor: "#ef4444" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col px-16 py-8 text-lg w-[500px]">
      <h2 className="text-2xl font-bold text-teal-600 mb-8 text-center">
        {venta ? "Editar Venta" : "Nueva Orden de Compra"}
      </h2>

      <div className="mb-4">
        <label className="block font-bold mb-1">Dirección de entrega</label>
        <input
          type="text"
          placeholder="Ej: Av. Principal 123, Santiago"
          className={`border rounded-lg block w-full p-2 ${errors.direccionCompra ? "border-red-400" : "border-gray-300"}`}
          {...register("direccionCompra", { required: "La dirección es obligatoria" })}
        />
        {errors.direccionCompra && <p className="text-red-500 text-sm mt-1">{errors.direccionCompra.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block font-bold mb-1">Valor de compra ($)</label>
        <input
          type="number"
          min={0}
          placeholder="Ej: 50000"
          className={`border rounded-lg block w-full p-2 ${errors.valorCompra ? "border-red-400" : "border-gray-300"}`}
          {...register("valorCompra", { required: "El valor es obligatorio", min: { value: 0, message: "Debe ser mayor a 0" } })}
        />
        {errors.valorCompra && <p className="text-red-500 text-sm mt-1">{errors.valorCompra.message}</p>}
      </div>

      <div className="mb-6">
        <label className="block font-bold mb-1">Fecha de compra</label>
        <input
          type="date"
          className={`border rounded-lg block w-full p-2 ${errors.fechaCompra ? "border-red-400" : "border-gray-300"}`}
          {...register("fechaCompra", { required: "La fecha es obligatoria" })}
        />
        {errors.fechaCompra && <p className="text-red-500 text-sm mt-1">{errors.fechaCompra.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="py-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold transition-colors disabled:opacity-60"
      >
        {isSubmitting ? "Guardando..." : venta ? "Actualizar Venta" : "Crear Venta"}
      </button>
    </form>
  );
};

// Página principal de Ventas
export const PageVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null); // null = crear, objeto = editar

  const fetchVentas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_VENTAS}/api/v1/ventas`, {
        headers: { "Content-Type": "application/json", Accept: "application/json" }
      });
      setVentas(res.data);
    } catch (err) {
      setError("No se pudo conectar con el servidor de ventas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVentas(); }, []);

  const handleEliminar = async (idVenta) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar venta?",
      text: `Se eliminará la orden #${idVenta} permanentemente`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API_VENTAS}/api/v1/ventas/${idVenta}`);
        Swal.fire({ title: "Eliminada ✅", icon: "success", confirmButtonColor: "#0d9488" });
        fetchVentas();
      } catch {
        Swal.fire({ title: "Error", text: "No se pudo eliminar", icon: "error", confirmButtonColor: "#ef4444" });
      }
    }
  };

  const ventasFiltradas = ventas.filter((v) =>
    busqueda === "" ||
    String(v.idVenta).includes(busqueda) ||
    v.direccionCompra?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ventas</h1>
        <p className="text-gray-500 text-sm">Gestiona todas las órdenes de compra del sistema</p>
      </div>

      {/* Barra de acciones */}
      <div className="flex justify-between items-center mb-4 gap-3">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por N° o dirección..."
          className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:border-teal-500"
        />
        <div className="flex gap-2">
          <button
            onClick={fetchVentas}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            🔄 Actualizar
          </button>
          <button
            onClick={() => { setVentaSeleccionada(null); setOpenModal(true); }}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors"
          >
            + Nueva Venta
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
        {loading && (
          <div className="flex justify-center items-center py-16 text-teal-600 font-semibold">
            <svg className="animate-spin h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Cargando ventas...
          </div>
        )}
        {error && <div className="bg-red-50 text-red-700 p-4 m-4 rounded-lg text-sm">⚠️ {error}</div>}

        {!loading && !error && (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-teal-50 text-teal-800">
                <th className="px-4 py-3 text-left">N° Orden</th>
                <th className="px-4 py-3 text-left">Dirección</th>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-right">Valor</th>
                <th className="px-4 py-3 text-center">Despacho</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400">
                    No hay ventas registradas.
                  </td>
                </tr>
              ) : (
                ventasFiltradas.map((v) => (
                  <tr key={v.idVenta} className="border-t border-gray-100 hover:bg-teal-50/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-teal-700">#{v.idVenta}</td>
                    <td className="px-4 py-3">{v.direccionCompra}</td>
                    <td className="px-4 py-3">{v.fechaCompra}</td>
                    <td className="px-4 py-3 text-right font-semibold">${v.valorCompra?.toLocaleString("es-CL")}</td>
                    <td className="px-4 py-3 text-center">
                      {v.despachoGenerado ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">✅ Generado</span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">⏳ Pendiente</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => { setVentaSeleccionada(v); setOpenModal(true); }}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-200 transition-colors"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(v.idVenta)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200 transition-colors"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
        {!loading && !error && (
          <p className="text-right text-xs text-gray-400 p-2">
            {ventasFiltradas.length} venta{ventasFiltradas.length !== 1 ? "s" : ""} encontrada{ventasFiltradas.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <FormVenta
          venta={ventaSeleccionada}
          onClose={() => setOpenModal(false)}
          onGuardado={fetchVentas}
        />
      </Modal>
    </div>
  );
};

