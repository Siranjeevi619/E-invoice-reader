import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UploadCloud } from "lucide-react";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState("");
  const [erp, setErp] = useState("");
  const [questionnaire, setQuestionnaire] = useState({
    webhooks: false,
    sandbox_env: false,
    retries: false,
  });

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !country || !erp) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("country", country);
      formData.append("erp", erp);

      const uploadRes = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { uploadId } = uploadRes.data;

      const analyzeRes = await axios.post(
        `${API_URL}/api/analyze`,
        { uploadId, questionnaire },
        { headers: { "Content-Type": "application/json" } }
      );

      navigate(`/result/${uploadId}`);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestionnaire = (key) => {
    setQuestionnaire((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const countries = ["UAE", "KSA", "MY"];
  const erps = ["SAP", "Oracle", "Microsoft Dynamics", "NetSuite"];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <UploadCloud size={48} className="text-blue-600 mb-2" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">
            Upload Invoice File
          </h2>
          <p className="text-gray-500 text-sm mt-1 text-center">
            Select a JSON file to analyze your invoice data.
          </p>
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={erp}
            onChange={(e) => setErp(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Select ERP</option>
            {erps.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>

          <label className="block w-full">
            <input
              type="file"
              accept=".json,.csv"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700
                         file:font-semibold hover:file:bg-blue-100 cursor-pointer"
            />
          </label>

          <div className="flex flex-col space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={questionnaire.webhooks}
                onChange={() => toggleQuestionnaire("webhooks")}
              />
              <span>Webhooks Enabled</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={questionnaire.sandbox_env}
                onChange={() => toggleQuestionnaire("sandbox_env")}
              />
              <span>Sandbox Environment</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={questionnaire.retries}
                onChange={() => toggleQuestionnaire("retries")}
              />
              <span>Retries Enabled</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !file || !country || !erp}
            className={`w-full px-4 py-3 sm:py-2 rounded-xl font-semibold text-white transition
                        ${
                          loading || !file || !country || !erp
                            ? "bg-blue-300 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
          >
            {loading ? "Uploading..." : "Upload & Analyze"}
          </button>
        </form>
      </div>
    </div>
  );
}
