import { BrowserRouter, Routes, Route } from "react-router-dom";
import Upload from "./pages/Upload";
import Result from "./pages/Result";
import Report from "./pages/Report";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    document.title = "Invox - Invoice Analayzer";
  });
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <Routes>
            <Route path="/" element={<Upload />} />
            <Route path="/result/:id" element={<Result />} />
            <Route path="/report" element={<Report />}></Route>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
