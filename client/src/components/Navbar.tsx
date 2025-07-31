import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="bg-white shadow-md px-4 sm:px-6 py-3 sticky top-0 z-10">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="text-xl font-bold text-gray-800">
          King Living Orders
        </Link>

        <div className="hidden sm:flex space-x-6 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-gray-900">
            Dashboard
          </Link>
          <Link to="/stock" className="hover:text-gray-900">
            Stock
          </Link>
          {/* Future links like <Link to="/settings">Settings</Link> */}
        </div>
      </div>
    </nav>
  );
}
