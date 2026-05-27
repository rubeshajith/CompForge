"use client";

// /components/playground/AIChatPreview.tsx

import { useState, useEffect, useRef } from "react";
import { AIChatConfig } from "@/lib/aiChatConfig";

interface AIChatPreviewProps {
  config: AIChatConfig;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type MessageRole = "user" | "ai";
type MessageType = "text" | "card" | "streaming";

interface Message {
  id: string;
  role: MessageRole;
  type: MessageType;
  content: string;
  timestamp: Date;
  card?: {
    label: string;
    title: string;
    body: string;
    tag: string;
  };
  isStreamComplete?: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "ai",
    type: "text",
    content: "Hello! I'm your AI assistant. How can I help you today?",
    timestamp: new Date(Date.now() - 120000),
    isStreamComplete: true,
  },
  {
    id: "2",
    role: "user",
    type: "text",
    content: "Tell me about TypeScript generics.",
    timestamp: new Date(Date.now() - 90000),
    isStreamComplete: true,
  },
  {
    id: "3",
    role: "ai",
    type: "card",
    content: "",
    timestamp: new Date(Date.now() - 60000),
    card: {
      label: "TypeScript",
      title: "Generics",
      body: "Generics allow you to write reusable, type-safe code by creating components that work with multiple types while preserving type information.",
      tag: "Core Concept",
    },
    isStreamComplete: true,
  },
];

const PROMPT_SUGGESTIONS = [
  "Explain async/await",
  "Show a code example",
  "What are React hooks?",
  "How does TypeScript help?",
];

const DEMO_STREAM_TEXT =
  "Generics are one of TypeScript's most powerful features. They let you write functions and classes that work with any type while still maintaining full type safety across your codebase...";

// ─── Sub-components ───────────────────────────────────────────────────────────

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getBubbleRadius(config: AIChatConfig, role: MessageRole) {
  const r = config.aiBubbleBorderRadius;
  if (config.bubbleStyle === "pill") return 999;
  if (config.bubbleStyle === "sharp") return 4;
  // rounded: clip the "tail" corner
  return r;
}

// Chat Bubble
function ChatBubble({
  message,
  config,
  animate,
}: {
  message: Message;
  config: AIChatConfig;
  animate: boolean;
}) {
  const isUser = message.role === "user";
  const radius = getBubbleRadius(config, message.role);

  const bubbleStyle: React.CSSProperties = isUser
    ? {
        background: config.userBubbleBackground,
        color: config.userBubbleTextColor,
        borderRadius: `${radius}px ${radius}px 4px ${radius}px`,
        padding: "10px 14px",
        maxWidth: "78%",
        fontSize: config.messageFontSize,
        fontFamily: "'Instrument Sans', sans-serif",
        lineHeight: 1.5,
        wordBreak: "break-word",
        boxShadow: config.showShadow ? "0 2px 8px rgba(0,0,0,0.3)" : "none",
      }
    : {
        background: config.aiBubbleBackground,
        color: config.aiBubbleTextColor,
        border: `1px solid ${config.aiBubbleBorderColor}`,
        borderRadius: `${radius}px ${radius}px ${radius}px 4px`,
        padding: "10px 14px",
        maxWidth: "82%",
        fontSize: config.messageFontSize,
        fontFamily: "'Instrument Sans', sans-serif",
        lineHeight: 1.5,
        wordBreak: "break-word",
        boxShadow: config.showShadow ? "0 2px 8px rgba(0,0,0,0.2)" : "none",
      };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        gap: 4,
        animation:
          animate && config.animateMessages
            ? "cf-msg-in 0.25s cubic-bezier(0.34,1.56,0.64,1) both"
            : "none",
      }}
    >
      <div style={bubbleStyle}>{message.content}</div>
      {config.showTimestamps && (
        <span
          style={{
            fontSize: 11,
            color: config.aiBubbleTextColor,
            opacity: 0.35,
            fontFamily: "'DM Mono', monospace",
            paddingLeft: isUser ? 0 : 4,
            paddingRight: isUser ? 4 : 0,
          }}
        >
          {formatTime(message.timestamp)}
        </span>
      )}
    </div>
  );
}

// Typing Indicator
function TypingIndicator({ config }: { config: AIChatConfig }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: config.typingBackground,
        border: `1px solid ${config.aiBubbleBorderColor}`,
        borderRadius: `${config.aiBubbleBorderRadius}px ${config.aiBubbleBorderRadius}px ${config.aiBubbleBorderRadius}px 4px`,
        padding: "10px 16px",
        width: "fit-content",
        animation: config.animateMessages
          ? "cf-msg-in 0.25s cubic-bezier(0.34,1.56,0.64,1) both"
          : "none",
      }}
    >
      {config.typingStyle === "dots" && (
        <>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: config.typingDotColor,
                display: "block",
                animation: `cf-dot-bounce 1.2s ease-in-out ${i * 0.18}s infinite`,
              }}
            />
          ))}
        </>
      )}
      {config.typingStyle === "pulse" && (
        <span
          style={{
            width: 36,
            height: 7,
            borderRadius: 4,
            background: config.typingDotColor,
            display: "block",
            animation: "cf-pulse 1.2s ease-in-out infinite",
          }}
        />
      )}
      {config.typingStyle === "bar" && (
        <>
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              style={{
                width: 3,
                height: 14,
                borderRadius: 2,
                background: config.typingDotColor,
                display: "block",
                animation: `cf-bar-wave 1s ease-in-out ${i * 0.12}s infinite`,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}

// Streaming Text
function StreamingBubble({
  config,
  text,
  done,
}: {
  config: AIChatConfig;
  text: string;
  done: boolean;
}) {
  const r = config.aiBubbleBorderRadius;
  return (
    <div
      style={{
        background: config.aiBubbleBackground,
        color: config.streamingTextColor,
        border: `1px solid ${config.aiBubbleBorderColor}`,
        borderRadius: `${r}px ${r}px ${r}px 4px`,
        padding: "10px 14px",
        maxWidth: "82%",
        fontSize: config.messageFontSize,
        fontFamily: "'Instrument Sans', sans-serif",
        lineHeight: 1.5,
        wordBreak: "break-word",
        boxShadow: config.showShadow ? "0 2px 8px rgba(0,0,0,0.2)" : "none",
        animation: config.animateMessages
          ? "cf-msg-in 0.25s cubic-bezier(0.34,1.56,0.64,1) both"
          : "none",
      }}
    >
      {text}
      {!done && (
        <span
          style={{
            display: "inline-block",
            width: 2,
            height: "1em",
            background: config.streamingCursorColor,
            marginLeft: 2,
            verticalAlign: "middle",
            borderRadius: 1,
            animation: "cf-cursor-blink 0.8s step-end infinite",
          }}
        />
      )}
    </div>
  );
}

// AI Response Card
function ResponseCard({
  card,
  config,
  animate,
}: {
  card: NonNullable<Message["card"]>;
  config: AIChatConfig;
  animate: boolean;
}) {
  return (
    <div
      style={{
        background: config.cardBackground,
        border: `1px solid ${config.cardBorderColor}`,
        borderRadius: config.cardBorderRadius,
        padding: "14px 16px",
        maxWidth: "86%",
        boxShadow: config.showShadow ? "0 2px 12px rgba(0,0,0,0.25)" : "none",
        animation:
          animate && config.animateMessages
            ? "cf-msg-in 0.25s cubic-bezier(0.34,1.56,0.64,1) both"
            : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* accent left bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: config.cardAccentColor,
          borderRadius: "4px 0 0 4px",
        }}
      />
      <div style={{ paddingLeft: 10 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontFamily: "'DM Mono', monospace",
              color: config.cardAccentColor,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              opacity: 0.85,
            }}
          >
            {card.label}
          </span>
          <span
            style={{
              fontSize: 10,
              fontFamily: "'DM Mono', monospace",
              color: config.cardLabelColor,
              background: config.containerBackground,
              border: `1px solid ${config.cardBorderColor}`,
              borderRadius: 4,
              padding: "1px 6px",
            }}
          >
            {card.tag}
          </span>
        </div>
        <div
          style={{
            fontSize: config.messageFontSize,
            fontFamily: "'Syne', sans-serif",
            fontWeight: 600,
            color: config.cardTextColor,
            marginBottom: 6,
          }}
        >
          {card.title}
        </div>
        <div
          style={{
            fontSize: config.fontSize,
            fontFamily: "'Instrument Sans', sans-serif",
            color: config.cardTextColor,
            opacity: 0.75,
            lineHeight: 1.55,
          }}
        >
          {card.body}
        </div>
      </div>
    </div>
  );
}

// Prompt Suggestions
function PromptSuggestions({
  config,
  onSelect,
}: {
  config: AIChatConfig;
  onSelect: (s: string) => void;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        padding: "8px 14px 0",
      }}
    >
      {PROMPT_SUGGESTIONS.map((s, i) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          onMouseEnter={() => setHoveredIdx(i)}
          onMouseLeave={() => setHoveredIdx(null)}
          style={{
            background:
              hoveredIdx === i
                ? config.suggestionHoverBackground
                : config.suggestionBackground,
            border: `1px solid ${hoveredIdx === i ? config.accentColor + "66" : config.suggestionBorderColor}`,
            borderRadius: config.suggestionBorderRadius,
            color:
              hoveredIdx === i
                ? config.accentColor
                : config.suggestionTextColor,
            fontSize: config.fontSize,
            fontFamily: "'Instrument Sans', sans-serif",
            padding: "5px 12px",
            cursor: "pointer",
            transition: "all 0.15s ease",
            outline: "none",
          }}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

// ─── Main Preview ─────────────────────────────────────────────────────────────

export function AIChatPreview({ config }: AIChatPreviewProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [streamText, setStreamText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, streamText]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      type: "text",
      content: text,
      timestamp: new Date(),
      isStreamComplete: true,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    // Show typing
    setTimeout(() => {
      setIsTyping(true);
    }, 200);

    // Start streaming after delay
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
          const finalText = DEMO_STREAM_TEXT.slice(0, i);
          setStreamText(finalText);
          setTimeout(() => {
            setStreamingId(null);
            const aiMsg: Message = {
              id: sid,
              role: "ai",
              type: "text",
              content: finalText,
              timestamp: new Date(),
              isStreamComplete: true,
            };
            setMessages((prev) => [...prev, aiMsg]);
            setStreamText("");
          }, 300);
        } else {
          setStreamText(DEMO_STREAM_TEXT.slice(0, i));
        }
      }, 40);
    }, 1400);
  };

  const containerStyle: React.CSSProperties = {
    width: config.containerWidth,
    height: config.containerHeight,
    background: config.containerBackground,
    border: `1px solid ${config.containerBorderColor}`,
    borderRadius: config.containerBorderRadius,
    boxShadow: config.showShadow ? "0 8px 48px rgba(0,0,0,0.6)" : "none",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    fontFamily: "'Instrument Sans', sans-serif",
    position: "relative",
  };

  return (
    <>
      {/* Keyframe animations injected via style tag */}
      <style>{`
        @keyframes cf-dot-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes cf-pulse {
          0%, 100% { opacity: 0.3; transform: scaleX(0.7); }
          50% { opacity: 1; transform: scaleX(1); }
        }
        @keyframes cf-bar-wave {
          0%, 100% { transform: scaleY(0.4); opacity: 0.5; }
          50% { transform: scaleY(1); opacity: 1; }
        }
        @keyframes cf-cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes cf-msg-in {
          from { opacity: 0; transform: translateY(10px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div style={containerStyle}>
        {/* Header */}
        <div
          style={{
            background: config.headerBackground,
            borderBottom: `1px solid ${config.headerBorderColor}`,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: config.avatarBackground,
              border: `1.5px solid ${config.accentColor}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"
                fill={config.avatarColor}
              />
              <circle cx="12" cy="8" r="2" fill={config.avatarColor} />
              <path d="M8 10h8v8H8z" fill={config.avatarBackground} />
              <path
                d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9zm0 2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 13H10v-6h4v6z"
                fill={config.avatarColor}
              />
            </svg>
            {/* Status dot */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: config.statusDotColor,
                border: `1.5px solid ${config.headerBackground}`,
              }}
            />
          </div>

          <div>
            <div
              style={{
                fontSize: config.fontSize + 1,
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                color: config.headerTextColor,
                lineHeight: 1.2,
              }}
            >
              AI Assistant
            </div>
            <div
              style={{
                fontSize: 11,
                fontFamily: "'DM Mono', monospace",
                color: config.statusDotColor,
                opacity: 0.9,
              }}
            >
              Online
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            scrollbarWidth: "thin",
            scrollbarColor: `${config.containerBorderColor} transparent`,
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              {msg.type === "card" && msg.card ? (
                <ResponseCard
                  card={msg.card}
                  config={config}
                  animate={idx === messages.length - 1}
                />
              ) : (
                <ChatBubble
                  message={msg}
                  config={config}
                  animate={idx === messages.length - 1}
                />
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <TypingIndicator config={config} />
            </div>
          )}

          {/* Streaming bubble */}
          {streamingId && (
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <StreamingBubble config={config} text={streamText} done={false} />
            </div>
          )}
        </div>

        {/* Prompt Suggestions */}
        <PromptSuggestions config={config} onSelect={(s) => setInputValue(s)} />

        {/* Input */}
        <div
          style={{
            padding: "10px 12px 12px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 8,
              background: config.inputBackground,
              border: `1px solid ${config.inputBorderColor}`,
              borderRadius: 12,
              padding: "6px 6px 6px 12px",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(inputValue)}
              placeholder="Type a message..."
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: config.inputTextColor,
                fontSize: config.fontSize + 1,
                fontFamily: "'Instrument Sans', sans-serif",
              }}
            />
            <button
              onClick={() => sendMessage(inputValue)}
              style={{
                background: config.sendButtonBackground,
                border: "none",
                borderRadius: config.sendButtonBorderRadius,
                color: config.sendButtonColor,
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 2L11 13"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M22 2L15 22L11 13L2 9L22 2Z"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
