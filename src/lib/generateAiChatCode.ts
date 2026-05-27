// /lib/generateAIChatCode.ts

import { AIChatConfig } from "./aiChatConfig";

export function generateAIChatJSX(config: AIChatConfig): string {
  const r = config.aiBubbleBorderRadius;
  const bubbleRadius =
    config.bubbleStyle === "pill"
      ? 999
      : config.bubbleStyle === "sharp"
        ? 4
        : r;

  return `import { useState, useEffect, useRef } from "react";
import "./AIChat.css";

const PROMPT_SUGGESTIONS = [
  "Explain async/await",
  "Show a code example",
  "What are React hooks?",
  "How does TypeScript help?",
];

const DEMO_STREAM_TEXT =
  "Here's a detailed response that streams in token by token, just like a real AI assistant would reply to your message in real time...";

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function ChatBubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={\`ac-bubble-wrap ac-bubble-wrap--\${isUser ? "user" : "ai"}\`}>
      <div className={\`ac-bubble ac-bubble--\${isUser ? "user" : "ai"}\`}>
        {message.content}
      </div>
      ${config.showTimestamps ? `<span className="ac-bubble__time">{formatTime(message.timestamp)}</span>` : ""}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="ac-typing">
      ${
        config.typingStyle === "dots"
          ? `<span className="ac-typing__dot" /><span className="ac-typing__dot" /><span className="ac-typing__dot" />`
          : config.typingStyle === "pulse"
            ? `<span className="ac-typing__pulse" />`
            : `<span className="ac-typing__bar" /><span className="ac-typing__bar" /><span className="ac-typing__bar" /><span className="ac-typing__bar" />`
      }
    </div>
  );
}

function StreamingBubble({ text, done }) {
  return (
    <div className="ac-bubble ac-bubble--ai ac-bubble--streaming">
      {text}
      {!done && <span className="ac-streaming-cursor" />}
    </div>
  );
}

function ResponseCard({ card }) {
  return (
    <div className="ac-card">
      <div className="ac-card__accent" />
      <div className="ac-card__body">
        <div className="ac-card__meta">
          <span className="ac-card__label">{card.label}</span>
          <span className="ac-card__tag">{card.tag}</span>
        </div>
        <div className="ac-card__title">{card.title}</div>
        <div className="ac-card__text">{card.body}</div>
      </div>
    </div>
  );
}

function PromptSuggestions({ onSelect }) {
  return (
    <div className="ac-suggestions">
      {PROMPT_SUGGESTIONS.map((s) => (
        <button key={s} className="ac-suggestion" onClick={() => onSelect(s)}>
          {s}
        </button>
      ))}
    </div>
  );
}

export default function AIChat({ onMessageSend }) {
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "ai",
      type: "text",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
    {
      id: "2",
      role: "ai",
      type: "card",
      content: "",
      timestamp: new Date(),
      card: {
        label: "TypeScript",
        title: "Generics",
        body: "Generics allow you to write reusable, type-safe code by creating components that work with multiple types.",
        tag: "Core Concept",
      },
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamingId, setStreamingId] = useState(null);
  const [streamText, setStreamText] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, streamText]);

  function sendMessage(text) {
    if (!text.trim()) return;
    const userMsg = { id: Date.now().toString(), role: "user", type: "text", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    if (onMessageSend) onMessageSend(text);

    setTimeout(() => setIsTyping(true), 200);

    setTimeout(() => {
      setIsTyping(false);
      const sid = (Date.now() + 1).toString();
      setStreamingId(sid);
      setStreamText("");
      let i = 0;
      const interval = setInterval(() => {
        i += Math.floor(Math.random() * 4) + 2;
        if (i >= DEMO_STREAM_TEXT.length) {
          i = DEMO_STREAM_TEXT.length;
          clearInterval(interval);
          const final = DEMO_STREAM_TEXT.slice(0, i);
          setStreamText(final);
          setTimeout(() => {
            setStreamingId(null);
            setMessages((prev) => [...prev, { id: sid, role: "ai", type: "text", content: final, timestamp: new Date() }]);
            setStreamText("");
          }, 300);
        } else {
          setStreamText(DEMO_STREAM_TEXT.slice(0, i));
        }
      }, 40);
    }, 1400);
  }

  return (
    <div className="ac-wrap">
      <div className="ac-header">
        <div className="ac-header__avatar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="3" fill="currentColor" />
            <path d="M8 14h8v6H8z" fill="currentColor" opacity="0.7" />
          </svg>
          <span className="ac-header__status" />
        </div>
        <div className="ac-header__info">
          <div className="ac-header__name">AI Assistant</div>
          <div className="ac-header__online">Online</div>
        </div>
      </div>

      <div className="ac-messages" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={\`ac-row ac-row--\${msg.role}\`}>
            {msg.type === "card" && msg.card
              ? <ResponseCard card={msg.card} />
              : <ChatBubble message={msg} />
            }
          </div>
        ))}
        {isTyping && <div className="ac-row ac-row--ai"><TypingIndicator /></div>}
        {streamingId && <div className="ac-row ac-row--ai"><StreamingBubble text={streamText} done={false} /></div>}
      </div>

      <PromptSuggestions onSelect={(s) => setInputValue(s)} />

      <div className="ac-input-area">
        <div className="ac-input-wrap">
          <input
            className="ac-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(inputValue)}
            placeholder="Type a message..."
          />
          <button className="ac-send" onClick={() => sendMessage(inputValue)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
`;
}

export function generateAIChatCSS(config: AIChatConfig): string {
  const bubbleRadius =
    config.bubbleStyle === "pill"
      ? 999
      : config.bubbleStyle === "sharp"
        ? 4
        : config.aiBubbleBorderRadius;

  const shadow = config.showShadow ? "0 8px 48px rgba(0,0,0,0.6)" : "none";
  const msgIn = config.animateMessages
    ? `@keyframes ac-msg-in {
  from { opacity: 0; transform: translateY(10px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}`
    : "";

  const animateProp = config.animateMessages
    ? "animation: ac-msg-in 0.25s cubic-bezier(0.34,1.56,0.64,1) both;"
    : "";

  return `/* AIChat.css — generated by CompForge */

/* ── Keyframes ─────────────────────────────────── */
${msgIn}

@keyframes ac-dot-bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
  40% { transform: translateY(-6px); opacity: 1; }
}

@keyframes ac-pulse {
  0%, 100% { opacity: 0.3; transform: scaleX(0.7); }
  50% { opacity: 1; transform: scaleX(1); }
}

@keyframes ac-bar-wave {
  0%, 100% { transform: scaleY(0.4); opacity: 0.5; }
  50% { transform: scaleY(1); opacity: 1; }
}

@keyframes ac-cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* ── Container ──────────────────────────────────── */
.ac-wrap {
  width: ${config.containerWidth}px;
  height: ${config.containerHeight}px;
  background: ${config.containerBackground};
  border: 1px solid ${config.containerBorderColor};
  border-radius: ${config.containerBorderRadius}px;
  box-shadow: ${shadow};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Instrument Sans', sans-serif;
}

/* ── Header ─────────────────────────────────────── */
.ac-header {
  background: ${config.headerBackground};
  border-bottom: 1px solid ${config.headerBorderColor};
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.ac-header__avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${config.avatarBackground};
  border: 1.5px solid ${config.accentColor}44;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
  color: ${config.avatarColor};
}

.ac-header__status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: ${config.statusDotColor};
  border: 1.5px solid ${config.headerBackground};
}

.ac-header__name {
  font-size: ${config.fontSize + 1}px;
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  color: ${config.headerTextColor};
  line-height: 1.2;
}

.ac-header__online {
  font-size: 11px;
  font-family: 'DM Mono', monospace;
  color: ${config.statusDotColor};
  opacity: 0.9;
}

/* ── Messages ───────────────────────────────────── */
.ac-messages {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scrollbar-width: thin;
  scrollbar-color: ${config.containerBorderColor} transparent;
}

.ac-row {
  display: flex;
  flex-direction: column;
}

.ac-row--user { align-items: flex-end; }
.ac-row--ai   { align-items: flex-start; }

/* ── Chat Bubbles ────────────────────────────────── */
.ac-bubble-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
  ${animateProp}
}

.ac-bubble-wrap--user { align-items: flex-end; }
.ac-bubble-wrap--ai   { align-items: flex-start; }

.ac-bubble {
  padding: 10px 14px;
  max-width: 80%;
  font-size: ${config.messageFontSize}px;
  font-family: 'Instrument Sans', sans-serif;
  line-height: 1.5;
  word-break: break-word;
}

.ac-bubble--user {
  background: ${config.userBubbleBackground};
  color: ${config.userBubbleTextColor};
  border-radius: ${bubbleRadius}px ${bubbleRadius}px 4px ${bubbleRadius}px;
  ${config.showShadow ? "box-shadow: 0 2px 8px rgba(0,0,0,0.3);" : ""}
}

.ac-bubble--ai {
  background: ${config.aiBubbleBackground};
  color: ${config.aiBubbleTextColor};
  border: 1px solid ${config.aiBubbleBorderColor};
  border-radius: ${bubbleRadius}px ${bubbleRadius}px ${bubbleRadius}px 4px;
  ${config.showShadow ? "box-shadow: 0 2px 8px rgba(0,0,0,0.2);" : ""}
}

.ac-bubble__time {
  font-size: 11px;
  font-family: 'DM Mono', monospace;
  color: ${config.aiBubbleTextColor};
  opacity: 0.35;
  padding: 0 4px;
}

/* ── Typing Indicator ────────────────────────────── */
.ac-typing {
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${config.typingBackground};
  border: 1px solid ${config.aiBubbleBorderColor};
  border-radius: ${bubbleRadius}px ${bubbleRadius}px ${bubbleRadius}px 4px;
  padding: 10px 16px;
  width: fit-content;
  ${animateProp}
}

.ac-typing__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${config.typingDotColor};
  display: block;
}

.ac-typing__dot:nth-child(1) { animation: ac-dot-bounce 1.2s ease-in-out 0s infinite; }
.ac-typing__dot:nth-child(2) { animation: ac-dot-bounce 1.2s ease-in-out 0.18s infinite; }
.ac-typing__dot:nth-child(3) { animation: ac-dot-bounce 1.2s ease-in-out 0.36s infinite; }

.ac-typing__pulse {
  width: 36px;
  height: 7px;
  border-radius: 4px;
  background: ${config.typingDotColor};
  display: block;
  animation: ac-pulse 1.2s ease-in-out infinite;
}

.ac-typing__bar {
  width: 3px;
  height: 14px;
  border-radius: 2px;
  background: ${config.typingDotColor};
  display: block;
}

.ac-typing__bar:nth-child(1) { animation: ac-bar-wave 1s ease-in-out 0s infinite; }
.ac-typing__bar:nth-child(2) { animation: ac-bar-wave 1s ease-in-out 0.12s infinite; }
.ac-typing__bar:nth-child(3) { animation: ac-bar-wave 1s ease-in-out 0.24s infinite; }
.ac-typing__bar:nth-child(4) { animation: ac-bar-wave 1s ease-in-out 0.36s infinite; }

/* ── Streaming ───────────────────────────────────── */
.ac-bubble--streaming {
  ${animateProp}
}

.ac-streaming-cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background: ${config.streamingCursorColor};
  margin-left: 2px;
  vertical-align: middle;
  border-radius: 1px;
  animation: ac-cursor-blink 0.8s step-end infinite;
}

/* ── Response Card ───────────────────────────────── */
.ac-card {
  background: ${config.cardBackground};
  border: 1px solid ${config.cardBorderColor};
  border-radius: ${config.cardBorderRadius}px;
  padding: 14px 16px;
  max-width: 86%;
  position: relative;
  overflow: hidden;
  ${config.showShadow ? "box-shadow: 0 2px 12px rgba(0,0,0,0.25);" : ""}
  ${animateProp}
}

.ac-card__accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: ${config.cardAccentColor};
  border-radius: 4px 0 0 4px;
}

.ac-card__body {
  padding-left: 10px;
}

.ac-card__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.ac-card__label {
  font-size: 10px;
  font-family: 'DM Mono', monospace;
  color: ${config.cardAccentColor};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.85;
}

.ac-card__tag {
  font-size: 10px;
  font-family: 'DM Mono', monospace;
  color: ${config.cardLabelColor};
  background: ${config.containerBackground};
  border: 1px solid ${config.cardBorderColor};
  border-radius: 4px;
  padding: 1px 6px;
}

.ac-card__title {
  font-size: ${config.messageFontSize}px;
  font-family: 'Syne', sans-serif;
  font-weight: 600;
  color: ${config.cardTextColor};
  margin-bottom: 6px;
}

.ac-card__text {
  font-size: ${config.fontSize}px;
  font-family: 'Instrument Sans', sans-serif;
  color: ${config.cardTextColor};
  opacity: 0.75;
  line-height: 1.55;
}

/* ── Prompt Suggestions ──────────────────────────── */
.ac-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 14px 0;
}

.ac-suggestion {
  background: ${config.suggestionBackground};
  border: 1px solid ${config.suggestionBorderColor};
  border-radius: ${config.suggestionBorderRadius}px;
  color: ${config.suggestionTextColor};
  font-size: ${config.fontSize}px;
  font-family: 'Instrument Sans', sans-serif;
  padding: 5px 12px;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.ac-suggestion:hover {
  background: ${config.suggestionHoverBackground};
  border-color: ${config.accentColor}66;
  color: ${config.accentColor};
}

/* ── Input Area ──────────────────────────────────── */
.ac-input-area {
  padding: 10px 12px 12px;
  flex-shrink: 0;
}

.ac-input-wrap {
  display: flex;
  gap: 8px;
  background: ${config.inputBackground};
  border: 1px solid ${config.inputBorderColor};
  border-radius: 12px;
  padding: 6px 6px 6px 12px;
  align-items: center;
}

.ac-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: ${config.inputTextColor};
  font-size: ${config.fontSize + 1}px;
  font-family: 'Instrument Sans', sans-serif;
}

.ac-input::placeholder {
  color: ${config.inputPlaceholderColor};
}

.ac-send {
  background: ${config.sendButtonBackground};
  border: none;
  border-radius: ${config.sendButtonBorderRadius}px;
  color: ${config.sendButtonColor};
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: opacity 0.15s;
}

.ac-send:hover { opacity: 0.85; }
`;
}
