import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center gap-2">
          📊 E-Invoicing Analyzer
        </h1>
        <span className="hidden sm:inline text-sm text-gray-300">
          Mini Product
        </span>

        <ul className="hidden sm:flex space-x-4">
          <li>
            <Link
              to="/"
              className="px-3 py-1 hover:bg-gray-700 rounded transition"
            >
              Upload
            </Link>
          </li>
          <li>
            <Link
              to="/report"
              className="px-3 py-1 hover:bg-gray-700 rounded transition"
            >
              Report
            </Link>
          </li>
        </ul>

        <button
          className="sm:hidden flex items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen && (
        <ul className="sm:hidden mt-3 space-y-2">
          <li>
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 hover:bg-gray-700 rounded transition"
            >
              Upload
            </Link>
          </li>
          <li>
            <Link
              to="/report"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 hover:bg-gray-700 rounded transition"
            >
              Report
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
