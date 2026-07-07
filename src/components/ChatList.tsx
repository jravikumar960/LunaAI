import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import type { ChatMessage as Message } from "../types/chat";

interface Props {
  messages: Message[];
  loading: boolean;
}

export default function ChatList({
  messages,
  loading,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  return (
    <div className="chat-window">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
        />
      ))}

      {loading && (
        <div className="message ai">
          🤖 Luna is typing...
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}