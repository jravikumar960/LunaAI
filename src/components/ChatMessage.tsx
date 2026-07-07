import { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { ChatMessage as Message } from "../types/chat";

interface Props {
  message: Message;
}

export default function ChatMessage({ message }: Props) {
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  async function copyText() {
    await navigator.clipboard.writeText(message.content);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  function speak() {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(message.content);

    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setSpeaking(true);
    };

    utterance.onend = () => {
      setSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }

  return (
    <div
      className={
        message.role === "assistant"
          ? "message ai"
          : "message user"
      }
      style={{ position: "relative" }}
    >
      <div
        style={{
          lineHeight: 1.7,
        }}
      >
        <ReactMarkdown
          components={{
            code({ children }) {
              return (
                <code
                  style={{
                    background: "#202938",
                    padding: "3px 6px",
                    borderRadius: 6,
                    fontFamily: "monospace",
                  }}
                >
                  {children}
                </code>
              );
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>

      {message.role === "assistant" && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 10,
          }}
        >
          <button
            onClick={copyText}
            style={{
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "6px 14px",
              cursor: "pointer",
            }}
          >
            {copied ? "✅ Copied" : "📋 Copy"}
          </button>

          <button
            onClick={speak}
            style={{
              background: "#8b5cf6",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "6px 14px",
              cursor: "pointer",
            }}
          >
            {speaking ? "⏹ Stop" : "🔊 Speak"}
          </button>
        </div>
      )}
    </div>
  );
}