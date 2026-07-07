import { useEffect, useState } from "react";
import {
  getMemory,
  deleteMemory,
  clearMemory,
} from "../services/memory";

interface MemoryItem {
  key: string;
  value: string;
}

export default function Memory() {
  const [items, setItems] = useState<MemoryItem[]>([]);

  async function load() {
    const data = await getMemory();

    // Hide the huge PDF text from the UI
    setItems(data.filter((item: MemoryItem) => item.key !== "pdf_text"));
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(key: string) {
    await deleteMemory(key);
    load();
  }

  async function clear() {
    if (!confirm("Clear all memories?")) return;

    await clearMemory();
    load();
  }

  return (
    <div style={{ padding: 30 }}>
      <h2>🧠 Memories</h2>

      <br />

      {items.length === 0 && (
        <p>No memories saved.</p>
      )}

      {items.map((item) => (
        <div
          key={item.key}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 15,
            padding: 15,
            background: "#1d2638",
            borderRadius: 10,
          }}
        >
          <div>
            <strong>{item.key}</strong>

            <br />

            <span>{item.value}</span>
          </div>

          <button
            onClick={() => remove(item.key)}
            style={{
              background: "#ff4d4f",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "8px 15px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      ))}

      {items.length > 0 && (
        <button
          onClick={clear}
          style={{
            marginTop: 20,
            background: "#ff4d4f",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Clear All Memory
        </button>
      )}
    </div>
  );
}