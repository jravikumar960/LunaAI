import { useState } from "react";
import { analyzeImage } from "../services/vision";

export default function Vision() {

  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("Describe this image.");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function analyze() {

    if (!file) {
      alert("Please select an image.");
      return;
    }

    setLoading(true);

    try {
      const data = await analyzeImage(file, prompt);
      setResponse(data.response);
    } catch {
      alert("Image analysis failed.");
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: 30 }}>

      <h2>👁 AI Vision</h2>

      <br />

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
      />

      <br /><br />

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
        }}
      />

      <br /><br />

      <button onClick={analyze}>
        {loading ? "Analyzing..." : "Analyze Image"}
      </button>

      <br /><br />

      {response && (
        <div
          style={{
            background: "#1d2638",
            padding: 20,
            borderRadius: 10,
            whiteSpace: "pre-wrap",
          }}
        >
          {response}
        </div>
      )}

    </div>
  );
}