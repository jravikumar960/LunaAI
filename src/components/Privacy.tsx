import { clearAllPrivacy } from "../services/privacy";

export default function Privacy() {

  async function clearAll() {

    const ok = confirm(
      "This will delete ALL chat history, memories and documents.\n\nContinue?"
    );

    if (!ok) return;

    await clearAllPrivacy();

    alert("✅ All data has been deleted.");

    window.location.reload();
  }

  return (
    <div style={{ padding: 30 }}>

      <h2>🔒 Privacy</h2>

      <br />

      <p>
        Delete all personal data stored by Luna.
      </p>

      <br />

      <button
        onClick={clearAll}
        style={{
          background: "#ff4d4f",
          color: "white",
          border: "none",
          padding: "14px 25px",
          borderRadius: 8,
          cursor: "pointer",
          fontSize: 16,
        }}
      >
        🗑 Clear All Data
      </button>

    </div>
  );
}