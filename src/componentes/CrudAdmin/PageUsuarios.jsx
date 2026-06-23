export const PageUsuarios = () => {
  const usuarios = [
    { nombre: "Administrador", rol: "Admin", acceso: "Total", estado: "Activo" },
    { nombre: "Operador Despacho", rol: "Operador", acceso: "Despachos y Ventas", estado: "Activo" },
    { nombre: "Supervisor", rol: "Supervisor", acceso: "Solo lectura", estado: "Activo" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Usuarios del sistema</h1>
        <p className="text-gray-500 text-sm">Roles y permisos de acceso al panel</p>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg p-4 mb-6 text-sm">
        ℹ️ La gestión de usuarios se administra directamente en el backend. Esta vista es de solo lectura.
      </div>

      {/* Tabla de roles */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-teal-50 text-teal-800">
              <th className="px-4 py-3 text-left">Usuario</th>
              <th className="px-4 py-3 text-left">Rol</th>
              <th className="px-4 py-3 text-left">Nivel de acceso</th>
              <th className="px-4 py-3 text-center">Estado</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u, i) => (
              <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-700">👤 {u.nombre}</td>
                <td className="px-4 py-3">{u.rol}</td>
                <td className="px-4 py-3 text-gray-600">{u.acceso}</td>
                <td className="px-4 py-3 text-center">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    ✅ {u.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Secciones del sistema */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: "💰", titulo: "Ventas", desc: "Crear, editar y eliminar órdenes de compra" },
          { icon: "🚚", titulo: "Despachos", desc: "Gestionar y cerrar órdenes de despacho" },
          { icon: "⚙️", titulo: "Configuración", desc: "Ajustar parámetros de conexión del sistema" },
        ].map((s) => (
          <div key={s.titulo} className="bg-white rounded-lg border border-gray-200 shadow p-4">
            <div className="text-3xl mb-2">{s.icon}</div>
            <h3 className="font-bold text-gray-800">{s.titulo}</h3>
            <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

