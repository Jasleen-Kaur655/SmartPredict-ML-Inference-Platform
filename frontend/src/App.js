import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function App() {
  const [feature, setFeature] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer mysecrettoken",
        },
        body: JSON.stringify({ feature: Number(feature) }),
      });

      const data = await response.json();
      const numericPrediction = Number(data.prediction);

      // 🔹 Fake confidence (for demo)
      const confidenceScore = Math.floor(80 + Math.random() * 20);

      setPrediction(numericPrediction);
      setConfidence(confidenceScore);

      setGraphData((prev) => [
        ...prev,
        { feature: Number(feature), prediction: numericPrediction },
      ]);

      setHistory((prev) => [
        ...prev,
        {
          feature: Number(feature),
          prediction: numericPrediction,
          confidence: confidenceScore,
        },
      ]);
    } catch (err) {
      setPrediction("Error calling API");
    }
  };

  const bgColor = darkMode ? "#0f172a" : "#f8fafc";
  const cardColor = darkMode ? "#1e293b" : "#ffffff";
  const textColor = darkMode ? "#f1f5f9" : "#0f172a";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bgColor,
        padding: "2rem",
        color: textColor,
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
          background: cardColor,
          padding: "2rem",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1>🔮 ML Prediction App</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
          <input
            type="number"
            step="any"
            value={feature}
            onChange={(e) => setFeature(e.target.value)}
            placeholder="Enter feature"
            required
            style={{
              padding: "0.6rem",
              borderRadius: "8px",
              width: "200px",
            }}
          />
          <button
            type="submit"
            style={{
              marginLeft: "1rem",
              padding: "0.6rem 1.2rem",
              borderRadius: "8px",
              background: "#6366f1",
              color: "white",
              border: "none",
            }}
          >
            Predict
          </button>
        </form>

        {prediction !== null && (
          <div style={{ marginTop: "1rem", fontSize: "1.2rem" }}>
            <p>📌 Prediction: <strong>{prediction}</strong></p>
            <p>🎯 Confidence: <strong>{confidence}%</strong></p>
          </div>
        )}

        {graphData.length > 0 && (
          <>
            <h2 style={{ marginTop: "2rem" }}>📈 Prediction Graph</h2>
            <LineChart width={750} height={300} data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="feature" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line dataKey="prediction" stroke="#6366f1" strokeWidth={3} />
            </LineChart>
          </>
        )}

        {history.length > 0 && (
          <>
            <h2 style={{ marginTop: "2rem" }}>⏱ Prediction History</h2>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "1rem",
              }}
            >
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Prediction</th>
                  <th>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.feature}</td>
                    <td>{row.prediction}</td>
                    <td>{row.confidence}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
