import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="rounded-xl w-[250px] min-h-[880px] bg-red-600 text-white sticky top-0 p-4 m-4">
      <h2 className="text-xl font-bold mb-8">Despacho Dashboard</h2>
      <ul className="space-y-3">
        <li>
          <Link to="/usuarios" className="block font-bold py-2 px-3 hover:bg-teal-700 rounded">
            Usuarios
          </Link>
        </li>
        <li>
          <Link to="/ventas" className="block font-bold py-2 px-3 hover:bg-teal-700 rounded">
            Ventas
          </Link>
        </li>
        <li>
          <Link to="/" className="block font-bold py-2 px-3 hover:bg-teal-700 rounded">
            Inicio
          </Link>
        </li>
      </ul>
    </nav>
  );
}
export default Navbar;