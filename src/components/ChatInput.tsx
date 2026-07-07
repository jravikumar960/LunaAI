import { useRef, useState } from "react";
import { uploadPDF } from "../services/ai";
import useVoice from "../hooks/useVoice";

interface Props {
  onSend: (message: string) => void;
  onPDFUploaded?: (filename: string) => void;
}

export default function ChatInput({
  onSend,
  onPDFUploaded,
}: Props) {
  const [message, setMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { listening, startListening } = useVoice(

  (text: string) => {
    setMessage(text);
  },

  (text: string) => {
    onSend(text);
    setMessage("");
  }

);
  function send() {
    if (!message.trim()) return;

    onSend(message);

    setMessage("");
  }

  async function handlePDF(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const result = await uploadPDF(file);

      onPDFUploaded?.(result.filename);
    } catch (err) {
      console.error(err);

      alert("❌ PDF upload failed.");
    }
  }

  return (
   <div
  className="input-box"
  onDragOver={(e) => e.preventDefault()}
  onDrop={async (e) => {
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];

    if (!file) return;

    if (file.type === "application/pdf") {
      try {
        const result = await uploadPDF(file);
        onPDFUploaded?.(result.filename);
      } catch {
        alert("❌ PDF upload failed.");
      }
    } else if (file.type.startsWith("image/")) {
      alert("🖼 Image dropped successfully. Please use the Vision page to analyze it.");
    } else {
      alert("Unsupported file type.");
    }
  }}
>

      <button
        onClick={() => fileInputRef.current?.click()}
      >
        📎
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        style={{ display: "none" }}
        onChange={handlePDF}
      />

      <input
        type="text"
        placeholder="Ask Luna anything..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            send();
          }
        }}
      />

      <button
        onClick={startListening}
        title="Voice Input"
      >
        {listening ? "🔴" : "🎤"}
      </button>

      <button
        className="send-btn"
        onClick={send}
      >
        ➜
      </button>

    </div>
  );
}