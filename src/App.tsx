import { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ChatInput from "./components/ChatInput";
import ChatMessage from "./components/ChatMessage";
import Documents from "./components/Documents";
import Memory from "./components/Memory";
import Automation from "./components/Automation";
import Privacy from "./components/Privacy";
import Settings from "./components/Settings";
import Vision from "./components/Vision";
import Files from "./components/Files";
import { exportChat } from "./services/export";
import History from "./components/History";
import "./index.css";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

export default function App() {
  // Default page
  const [selectedMenu, setSelectedMenu] = useState("Chat");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "👋 Hello Ravi! I'm Luna. Ask me anything.",
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const [thinking, setThinking] = useState(false);
  async function clearChat() {
  try {
    await fetch("http://127.0.0.1:8000/history", {
      method: "DELETE",
    });

    setMessages([
      {
        id: 1,
        role: "assistant",
        content: "👋 Hello Ravi! I'm Luna. Ask me anything.",
      },
    ]);
  } catch (err) {
    console.error(err);
  }
}

  async function loadHistory() {
    try {
      const res = await fetch("http://127.0.0.1:8000/history");
      const data = await res.json();

      if (data.length > 0) {
        const formatted = data.map((msg: any, index: number) => ({
          id: index + 1,
          role: msg.role,
          content: msg.content,
        }));

        setMessages(formatted);
      }
    } catch (err) {
      console.error(err);
    }
  }

 /* useEffect(() => {
    loadHistory();
  }, []);*/

  // Auto-scroll whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setThinking(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      const data = await res.json();

      const aiMessage: Message = {
    id: Date.now() + 1,
    role: "assistant",
    content: data.response,
};

setThinking(false);

setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "❌ Unable to contact Luna backend.",
        },
      ]);
    }
  }

  function handlePDFUploaded(filename: string) {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "assistant",
        content:
          `📄 PDF uploaded successfully.\n\nFile: ${filename}\n\nYou can now ask me questions about this document.`,
      },
    ]);
  }

  return (
    <div className="app-container">

      <Sidebar
        selected={selectedMenu}
        setSelected={setSelectedMenu}
      />

      <main className="main-content">

        <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <Header />

{selectedMenu === "Chat" && (
  <>
    <button
      onClick={clearChat}
      style={{
        background: "#ef4444",
        color: "white",
        border: "none",
        padding: "10px 18px",
        borderRadius: 10,
        cursor: "pointer",
        height: 42,
        marginTop: 20,
      }}
    >
      🗑️ Clear Chat
    </button>

    <button
      onClick={() => exportChat(messages)}
      style={{
        background: "#10b981",
        color: "white",
        border: "none",
        padding: "10px 18px",
        borderRadius: 10,
        cursor: "pointer",
        marginRight: 10,
      }}
    >
      📄 Export Chat
    </button>
  </>
)}
</div>
        {selectedMenu === "History" ? (

          <History />

        ) : selectedMenu === "Memory" ? (

          <Memory />
        ) : selectedMenu === "Files" ? (

          <Files />


        ) : selectedMenu === "Documents" ? (

          <Documents />

        ) : selectedMenu === "Vision" ? (

          <Vision />

        ) : selectedMenu === "Automation" ? (

          <Automation />

        ) : selectedMenu === "Privacy" ? (

          <Privacy />

        ) : selectedMenu === "Settings" ? (

          <Settings />

        ) : (

          <>
            <div className="chat-window">

              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                />
              ))}
              {thinking && (
  <div
    style={{
      background: "#1d2638",
      padding: 16,
      borderRadius: 12,
      marginBottom: 15,
      width: "fit-content",
      color: "white",
      fontStyle: "italic",
    }}
  >
    🤖 Luna is thinking...
  </div>
)}

              <div ref={bottomRef}></div>

            </div>

            <ChatInput
              onSend={sendMessage}
              onPDFUploaded={handlePDFUploaded}
            />
          </>

        )}

      </main>

    </div>
  );
}