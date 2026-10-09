import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "./api";

const suggestions = [
  { label: "Understand a topic", text: "Explain a difficult topic in simple terms." },
  { label: "Practice for a test", text: "Quiz me on a subject and explain my mistakes." },
  { label: "Study plan", text: "Help me make a focused study plan for this week." },
  { label: "Get unstuck", text: "I'm stuck on a problem. Can you guide me step by step?" },
];

function Brand() {
  return (
    <div className="brand-lockup">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4.5 5.75c2.8-.8 5.3-.3 7.5 1.5v12c-2.2-1.8-4.7-2.3-7.5-1.5v-12Zm15 0c-2.8-.8-5.3-.3-7.5 1.5v12c2.2-1.8 4.7-2.3 7.5-1.5v-12Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M8 9h1.5M8 12h1.5m6-3H17m-1.5 3H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
      <span>StudyBuddy</span>
    </div>
  );
}

function Dashboard() {
  const nav = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    nav("/log");
  };

  const send = (value = input) => {
    const text = value.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { from: "you", text }]);
    setInput("");
    setLoading(true);

    api
      .post("/chat/message", { text })
      .then((res) => {
        setMessages((prev) => [...prev, { from: "buddy", text: res.data.bot }]);
      })
      .catch((err) => {
        setMessages((prev) => [
          ...prev,
          {
            from: "buddy",
            text: err.response?.data?.msg || "Something went wrong. Please try again.",
          },
        ]);
      })
      .finally(() => setLoading(false));
  };

  const showWelcome = messages.length === 0;

  return (
    <div className="workspace">
      <aside className="workspace-sidebar">
        <Brand />
        <p className="sidebar-label">Workspace</p>
        <div className="nav-item nav-item-active">
          <span className="nav-icon" aria-hidden="true">✳</span>
          <span>Study chat</span>
        </div>
        <div className="sidebar-tip">
          <span className="tip-icon" aria-hidden="true">✦</span>
          <strong>A little tip</strong>
          <p>Ask follow-up questions to explore a topic more deeply.</p>
        </div>
      </aside>

      <main className="workspace-main">
        <header className="workspace-topbar">
          <span className="topbar-title">Study chat</span>
          <div className="topbar-right">
            <span className="online-status"><span className="online-dot" /> AI study assistant</span>
            <button className="logout-button" type="button" onClick={logout}>Log out</button>
          </div>
        </header>

        <section className="chat-content" aria-label="StudyBuddy conversation">
          {showWelcome && (
            <div className="welcome-block">
              <span className="welcome-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M4.5 5.75c2.8-.8 5.3-.3 7.5 1.5v12c-2.2-1.8-4.7-2.3-7.5-1.5v-12Zm15 0c-2.8-.8-5.3-.3-7.5 1.5v12c2.2-1.8 4.7-2.3 7.5-1.5v-12Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="m18.5 3 .5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5Z" fill="currentColor" />
                </svg>
              </span>
              <p className="eyebrow">Your personal study space</p>
              <h1>What would you like to learn?</h1>
              <p>Ask a question, work through a tricky idea, or get ready for your next exam.</p>
              <div className="suggestion-grid">
                {suggestions.map((item) => (
                  <button className="suggestion-card" key={item.label} type="button" onClick={() => send(item.text)}>
                    <span>{item.label}</span>
                    {item.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!showWelcome && (
            <div className="chat-window" aria-live="polite">
              {messages.map((message, index) => (
                <div className={`message-row ${message.from === "you" ? "message-row-you" : ""}`} key={`${index}-${message.from}`}>
                  <span className="message-avatar" aria-hidden="true">{message.from === "you" ? "Y" : "S"}</span>
                  <div className="message-bubble">{message.text}</div>
                </div>
              ))}
              {loading && (
                <div className="message-row" aria-live="polite">
                  <span className="message-avatar" aria-hidden="true">S</span>
                  <div className="message-bubble thinking">Putting a thoughtful answer together…</div>
                </div>
              )}
            </div>
          )}

          <div className="composer-wrap">
            <form className="composer" onSubmit={(event) => { event.preventDefault(); send(); }}>
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask StudyBuddy anything…"
                aria-label="Your study question"
              />
              <button className="send-button" type="submit" aria-label="Send message" disabled={!input.trim() || loading}>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 12 20 4l-5 16-3-6-8-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="m12 14 4-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </form>
            <p className="composer-note">StudyBuddy can make mistakes. Check important information with trusted sources.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
