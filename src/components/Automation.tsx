import { useEffect, useState } from "react";
import {
  getAutomation,
  addAutomation,
  deleteAutomation,
} from "../services/automation";

interface Reminder {
  id: number;
  title: string;
  remind_at: string;
}

export default function Automation() {
  const [items, setItems] = useState<Reminder[]>([]);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");

  async function load() {
    const data = await getAutomation();
    setItems(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function add() {
    if (!title.trim() || !time) {
      alert("Please enter reminder and time.");
      return;
    }

    await addAutomation(title, time);

    setTitle("");
    setTime("");

    load();
  }

  async function remove(id: number) {
    await deleteAutomation(id);
    load();
  }

  return (
    <div style={{ padding: 30 }}>
      <h2>⏰ Automation</h2>

      <br />

      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 25,
        }}
      >
        <input
          type="text"
          placeholder="Reminder"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            border: "none",
          }}
        />

        <input
          type="datetime-local"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{
            padding: 12,
            borderRadius: 8,
            border: "none",
          }}
        />

        <button
          onClick={add}
          style={{
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "12px 20px",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>

      {items.length === 0 ? (
        <p>No reminders created.</p>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#1d2638",
              padding: 15,
              marginBottom: 15,
              borderRadius: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong>{item.title}</strong>

              <br />

              <span>{item.remind_at}</span>
            </div>

            <button
              onClick={() => remove(item.id)}
              style={{
                background: "#ff4d4f",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}