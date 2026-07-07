import { useEffect, useState } from "react";

export default function Settings() {
  const [model, setModel] = useState("qwen2.5:3b");

  useEffect(() => {
    loadModel();
  }, []);

  async function loadModel() {
    try {
      const res = await fetch("http://127.0.0.1:8000/model");
      const data = await res.json();
      setModel(data.model);
    } catch (err) {
      console.error(err);
    }
  }

  async function changeModel(value: string) {
    setModel(value);

    try {
      await fetch("http://127.0.0.1:8000/model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: value,
        }),
      });

      alert(`✅ Switched to ${value}`);
    } catch (err) {
      alert("Unable to change model.");
      console.error(err);
    }
  }

  return (
    <div style={{ padding: 30 }}>
      <h2>⚙️ Settings</h2>

      <br />

      <div
        style={{
          background: "#1d2638",
          padding: 20,
          borderRadius: 10,
          marginBottom: 20,
        }}
      >
        <h3>🤖 AI Model</h3>

        <select
          value={model}
          onChange={(e) => changeModel(e.target.value)}
          style={{
            padding: 10,
            width: 250,
            borderRadius: 8,
            marginTop: 10,
          }}
        >
          <option value="qwen2.5:3b">qwen2.5:3b</option>
          <option value="llava:7b">llava:7b</option>
          <option value="llama3.2">llama3.2</option>
          <option value="phi3">phi3</option>
          <option value="mistral">mistral</option>
        </select>
      </div>

      <div
        style={{
          background: "#1d2638",
          padding: 20,
          borderRadius: 10,
          marginBottom: 20,
        }}
      >
        <h3>🎨 Theme</h3>
        <p>Dark Mode (Coming Soon)</p>
      </div>

      <div
        style={{
          background: "#1d2638",
          padding: 20,
          borderRadius: 10,
        }}
      >
        <h3>ℹ️ About</h3>
        <p>Luna AI Desktop Assistant</p>
        <p>Version 1.0</p>
      </div>
    </div>
  );
}