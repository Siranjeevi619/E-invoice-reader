export default function ScoreBars({ score }) {
  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="font-semibold mb-2">Overall Score</h3>
      <div className="w-full bg-gray-200 rounded h-4">
        <div
          className="bg-green-500 h-4 rounded"
          style={{ width: `${score}%` }}
        ></div>
      </div>
      <p className="text-sm mt-2">{score}% compliance</p>
    </div>
  );
}
