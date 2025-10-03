import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Upload() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const uploadRes = await axios.post(
      "http://localhost:5000/api/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const { uploadId } = uploadRes.data;
    console.log("Upload ID:", uploadId);

    const analyzeRes = await axios.post(
      "http://localhost:5000/api/analyze",
      {
        uploadId,
        questionnaire: {},
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );


    const { reportId } = analyzeRes.data;
    console.log("")
    navigate(`/result/${uploadId}`);
    
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Upload JSON File</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept=".json"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Upload & Analyze
        </button>
      </form>
    </div>
  );
}
