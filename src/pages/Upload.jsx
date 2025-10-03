import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UploadCloud } from "lucide-react"; 

export default function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const { uploadId } = uploadRes.data;
      console.log("Upload ID:", uploadId);

      const analyzeRes = await axios.post(
        "http://localhost:5000/api/analyze",
        { uploadId, questionnaire: {} },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Report ID:", analyzeRes.data.reportId);
      navigate(`/result/${uploadId}`);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <UploadCloud size={48} className="text-blue-600 mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">Upload JSON File</h2>
          <p className="text-gray-500 text-sm mt-1 text-center">
            Select a JSON file to analyze your invoice data.
          </p>
        </div>

        <form onSubmit={handleUpload} className="space-y-6">
          <label className="block">
            <input
              type="file"
              accept=".json"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700
                         file:font-semibold hover:file:bg-blue-100 cursor-pointer"
            />
          </label>

          <button
            type="submit"
            disabled={loading || !file}
            className={`w-full px-4 py-2 rounded-xl font-semibold text-white transition
                        ${
                          loading || !file
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
