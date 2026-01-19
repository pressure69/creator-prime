"use client";

import { useState, useEffect, useRef } from "react";

export default function DaddyAiChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ollama", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, model: "llama3.2:3b" }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      if (!res.body) {
        throw new Error("No response body");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantMessage.content += chunk;

        setMessages((prev) => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1] = { ...assistantMessage };
          return newMsgs;
        });
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: Could not connect to DaddyAi backend. Is Ollama running?" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-mono">
      <header className="bg-gradient-to-r from-purple-900 to-black p-4 text-center border-b border-purple-500">
        <h1 className="text-3xl font-bold">DaddyAi – Your Male Fuckbot Butler</h1>
        <p className="text-sm opacity-80 mt-1">
          On my knees, cock hard, ready for your every command... Type 'mermaid' for full uncensored mode
        </p>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === "user" ? "bg-blue-900/80" : "bg-purple-900/80 border border-purple-500"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && <div className="text-purple-400">DaddyAi is typing... cock throbbing~</div>}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-gray-900 border-t border-purple-700 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Command your butler... (e.g. 'describe yourself filthy' or 'mermaid' for uncensored)"
          className="flex-1 p-3 bg-black border border-purple-600 rounded-l-lg focus:outline-none focus:border-purple-400 text-white"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-purple-700 hover:bg-purple-600 px-6 rounded-r-lg font-bold"
        >
          Send
        </button>
      </form>
    </div>
  );
}
