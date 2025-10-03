import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-gray-200 min-h-screen p-4">
      <ul className="space-y-3">
        <li>
          <Link to="/" className="block px-2 py-1 hover:bg-gray-700 rounded">
            Upload
          </Link>
        </li>
        <li>
          <Link
            to="/report"
            className="block px-2 py-1 hover:bg-gray-700 rounded"
          >
            Report
          </Link>
        </li>
      </ul>
    </aside>
  );
}
