import { useEffect, useState } from "react";

interface Message {
  role: string;
  content: string;
}

export default function History() {
  const [history, setHistory] = useState<Message[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    const res = await fetch("http://127.0.0.1:8000/history");
    const data = await res.json();
    setHistory(data);
  }

  return (
    <div style={{ padding: 30 }}>
      <h2>🕘 Chat History</h2>

      <br />

      {history.map((msg, i) => (
        <div
          key={i}
          style={{
            background: msg.role === "assistant" ? "#1d2638" : "#2563eb",
            padding: 15,
            borderRadius: 10,
            marginBottom: 12,
          }}
        >
          <b>{msg.role}</b>

          <br />

          {msg.content}
        </div>
      ))}
    </div>
  );
}