import type { EmojiConfig } from "./emojiConfig";

export function generateEmojiJSX(config: EmojiConfig): string {
  const {
    variant,
    animation,
    size,
    faceColor,
    faceShadeColor,
    outlineColor,
    eyeColor,
    pupilColor,
    mouthColor,
    cheekColor,
    accentColor,
    backgroundColor,
    showBackground,
    backgroundRadius,
    backgroundPadding,
    animationDuration,
    animationEnabled,
    showShadow,
  } = config;

  const totalSize = size + backgroundPadding * 2;

  const animName: Record<string, string> = {
    bounce: "emojiBounce",
    spin: "emojiSpin",
    pulse: "emojiPulse",
    shake: "emojiShake",
    float: "emojiFloat",
    rubber: "emojiRubber",
  };

  const faceSVG: Record<string, string> = {
    happy: `
      <ellipse cx="50" cy="56" rx="38" ry="20" fill="${faceShadeColor}" opacity="0.4" />
      <ellipse cx="34" cy="40" rx="7" ry="8" fill="${eyeColor}" />
      <ellipse cx="36" cy="38" rx="2.5" ry="2.5" fill="${pupilColor}" />
      <ellipse cx="66" cy="40" rx="7" ry="8" fill="${eyeColor}" />
      <ellipse cx="68" cy="38" rx="2.5" ry="2.5" fill="${pupilColor}" />
      <ellipse cx="22" cy="56" rx="9" ry="6" fill="${cheekColor}" opacity="0.6" />
      <ellipse cx="78" cy="56" rx="9" ry="6" fill="${cheekColor}" opacity="0.6" />
      <path d="M32 60 Q50 78 68 60" stroke="${mouthColor}" strokeWidth="3.5" fill="none" strokeLinecap="round" />`,

    cool: `
      <ellipse cx="50" cy="56" rx="38" ry="20" fill="${faceShadeColor}" opacity="0.4" />
      <rect x="20" y="34" width="60" height="4" rx="2" fill="${eyeColor}" />
      <rect x="18" y="30" width="24" height="16" rx="6" fill="${eyeColor}" opacity="0.9" />
      <rect x="22" y="34" width="10" height="7" rx="3" fill="${accentColor}" opacity="0.5" />
      <rect x="58" y="30" width="24" height="16" rx="6" fill="${eyeColor}" opacity="0.9" />
      <rect x="62" y="34" width="10" height="7" rx="3" fill="${accentColor}" opacity="0.5" />
      <path d="M36 62 Q46 72 64 60" stroke="${mouthColor}" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <ellipse cx="22" cy="57" rx="9" ry="6" fill="${cheekColor}" opacity="0.5" />
      <ellipse cx="78" cy="57" rx="9" ry="6" fill="${cheekColor}" opacity="0.5" />`,

    love: `
      <ellipse cx="50" cy="56" rx="38" ry="20" fill="${faceShadeColor}" opacity="0.4" />
      <path d="M34 40.6 C34 36.3 28 36.3 28 41.9 C28 47.5 34 51.2 34 54 C34 51.2 40 47.5 40 41.9 C40 36.3 34 36.3 34 40.6Z" fill="${accentColor}" />
      <path d="M66 40.6 C66 36.3 60 36.3 60 41.9 C60 47.5 66 51.2 66 54 C66 51.2 72 47.5 72 41.9 C72 36.3 66 36.3 66 40.6Z" fill="${accentColor}" />
      <ellipse cx="22" cy="57" rx="9" ry="6" fill="${cheekColor}" opacity="0.65" />
      <ellipse cx="78" cy="57" rx="9" ry="6" fill="${cheekColor}" opacity="0.65" />
      <path d="M30 62 Q50 80 70 62" stroke="${mouthColor}" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M82 18.6 C82 14.3 76 14.3 76 19.9 C76 25.5 82 29.2 82 32 C82 29.2 88 25.5 88 19.9 C88 14.3 82 14.3 82 18.6Z" fill="${accentColor}" opacity="0.7" />
      <path d="M12 22.6 C12 18.3 6 18.3 6 23.9 C6 29.5 12 33.2 12 36 C12 33.2 18 29.5 18 23.9 C18 18.3 12 18.3 12 22.6Z" fill="${accentColor}" opacity="0.6" />`,

    fire: `
      <path d="M34 20 Q30 10 36 4 Q32 14 40 12 Q36 6 44 2 Q42 12 50 10 Q46 4 54 2 Q52 12 58 10 Q54 6 60 4 Q64 14 60 20" fill="${accentColor}" opacity="0.85" />
      <ellipse cx="50" cy="56" rx="38" ry="20" fill="${faceShadeColor}" opacity="0.4" />
      <path d="M26 35 L44 40" stroke="${eyeColor}" strokeWidth="4" strokeLinecap="round" />
      <path d="M74 35 L56 40" stroke="${eyeColor}" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="35" cy="44" rx="7" ry="7" fill="${eyeColor}" />
      <ellipse cx="37" cy="42" rx="2.5" ry="2.5" fill="#ef4444" />
      <ellipse cx="65" cy="44" rx="7" ry="7" fill="${eyeColor}" />
      <ellipse cx="67" cy="42" rx="2.5" ry="2.5" fill="#ef4444" />
      <path d="M33 62 Q50 56 67 62" stroke="${mouthColor}" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <ellipse cx="22" cy="56" rx="9" ry="6" fill="${cheekColor}" opacity="0.5" />
      <ellipse cx="78" cy="56" rx="9" ry="6" fill="${cheekColor}" opacity="0.5" />`,

    explode: `
      <line x1="92" y1="50" x2="102" y2="50" stroke="${accentColor}" strokeWidth="3" strokeLinecap="round" />
      <line x1="79.1" y1="20.9" x2="86.2" y2="13.8" stroke="${accentColor}" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="8" x2="50" y2="-2" stroke="${accentColor}" strokeWidth="3" strokeLinecap="round" />
      <line x1="20.9" y1="20.9" x2="13.8" y2="13.8" stroke="${accentColor}" strokeWidth="3" strokeLinecap="round" />
      <line x1="8" y1="50" x2="-2" y2="50" stroke="${accentColor}" strokeWidth="3" strokeLinecap="round" />
      <line x1="20.9" y1="79.1" x2="13.8" y2="86.2" stroke="${accentColor}" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="92" x2="50" y2="102" stroke="${accentColor}" strokeWidth="3" strokeLinecap="round" />
      <line x1="79.1" y1="79.1" x2="86.2" y2="86.2" stroke="${accentColor}" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="50" cy="56" rx="36" ry="18" fill="${faceShadeColor}" opacity="0.4" />
      <circle cx="34" cy="40" r="9" fill="white" />
      <circle cx="34" cy="40" r="5" fill="${eyeColor}" />
      <circle cx="36" cy="38" r="2" fill="${pupilColor}" />
      <circle cx="66" cy="40" r="9" fill="white" />
      <circle cx="66" cy="40" r="5" fill="${eyeColor}" />
      <circle cx="68" cy="38" r="2" fill="${pupilColor}" />
      <ellipse cx="50" cy="65" rx="10" ry="12" fill="${mouthColor}" />
      <ellipse cx="50" cy="65" rx="7" ry="8.5" fill="#1c0a00" />
      <ellipse cx="22" cy="54" rx="9" ry="6" fill="${cheekColor}" opacity="0.5" />
      <ellipse cx="78" cy="54" rx="9" ry="6" fill="${cheekColor}" opacity="0.5" />`,

    sleepy: `
      <ellipse cx="50" cy="58" rx="38" ry="18" fill="${faceShadeColor}" opacity="0.4" />
      <ellipse cx="34" cy="42" rx="7" ry="4" fill="${eyeColor}" />
      <ellipse cx="66" cy="42" rx="7" ry="4" fill="${eyeColor}" />
      <text x="70" y="28" fontSize="10" fontWeight="bold" fill="${accentColor}" fontFamily="sans-serif">z</text>
      <text x="76" y="20" fontSize="13" fontWeight="bold" fill="${accentColor}" fontFamily="sans-serif">z</text>
      <text x="83" y="13" fontSize="16" fontWeight="bold" fill="${accentColor}" fontFamily="sans-serif">Z</text>
      <ellipse cx="38" cy="72" rx="6" ry="8" fill="white" opacity="0.7" />
      <ellipse cx="38" cy="80" rx="4" ry="5" fill="white" opacity="0.6" />
      <path d="M36 64 Q50 70 64 60" stroke="${mouthColor}" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="22" cy="58" rx="9" ry="5" fill="${cheekColor}" opacity="0.5" />
      <ellipse cx="78" cy="58" rx="9" ry="5" fill="${cheekColor}" opacity="0.5" />`,
  };

  return `import { useEffect, useRef } from "react";
import "./Emoji.css";

export default function Emoji({ onAnimationCycle } = {}) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const handleEnd = () => onAnimationCycle?.();
    svg.addEventListener("animationiteration", handleEnd);
    return () => svg.removeEventListener("animationiteration", handleEnd);
  }, [onAnimationCycle]);

  const totalSize = ${totalSize};

  return (
    <div
      className="emoji-wrap"
      style={{
        width: totalSize,
        height: totalSize,
      }}
    >
      <svg
        ref={svgRef}
        className="emoji-svg${animationEnabled ? " emoji-svg--animated" : ""}"
        viewBox="0 0 100 100"
        width={${size}}
        height={${size}}
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="46" fill="${faceColor}" />
        <circle cx="50" cy="50" r="46" fill="none" stroke="${outlineColor}" strokeWidth="2" />
        ${faceSVG[variant]}
      </svg>
    </div>
  );
}
`;
}

export function generateEmojiCSS(config: EmojiConfig): string {
  const {
    animation,
    backgroundColor,
    showBackground,
    backgroundRadius,
    backgroundPadding,
    size,
    animationDuration,
    animationEnabled,
    showShadow,
  } = config;

  const totalSize = size + backgroundPadding * 2;

  const animMap: Record<string, string> = {
    bounce: `
@keyframes emojiBounce {
  0%, 100% { transform: translateY(0) scaleX(1) scaleY(1); }
  30%       { transform: translateY(-18%) scaleX(0.94) scaleY(1.06); }
  50%       { transform: translateY(0) scaleX(1.06) scaleY(0.94); }
  70%       { transform: translateY(-8%) scaleX(0.98) scaleY(1.02); }
}`,
    spin: `
@keyframes emojiSpin {
  0%   { transform: rotate(0deg) scale(1); }
  25%  { transform: rotate(90deg) scale(1.08); }
  50%  { transform: rotate(180deg) scale(1); }
  75%  { transform: rotate(270deg) scale(1.08); }
  100% { transform: rotate(360deg) scale(1); }
}`,
    pulse: `
@keyframes emojiPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  40%       { transform: scale(1.12); opacity: 0.9; }
  60%       { transform: scale(0.92); opacity: 1; }
}`,
    shake: `
@keyframes emojiShake {
  0%, 100% { transform: rotate(0deg) translateX(0); }
  15%       { transform: rotate(-8deg) translateX(-4px); }
  35%       { transform: rotate(8deg) translateX(4px); }
  55%       { transform: rotate(-6deg) translateX(-3px); }
  75%       { transform: rotate(6deg) translateX(3px); }
  90%       { transform: rotate(-2deg) translateX(-1px); }
}`,
    float: `
@keyframes emojiFloat {
  0%, 100% { transform: translateY(0) rotate(-1deg); }
  50%       { transform: translateY(-12%) rotate(1deg); }
}`,
    rubber: `
@keyframes emojiRubber {
  0%,  100% { transform: scaleX(1)    scaleY(1); }
  20%        { transform: scaleX(0.88) scaleY(1.2); }
  40%        { transform: scaleX(1.22) scaleY(0.82); }
  60%        { transform: scaleX(0.92) scaleY(1.1); }
  80%        { transform: scaleX(1.08) scaleY(0.94); }
}`,
  };

  const animKeyframe = animMap[animation] ?? animMap.bounce;
  const animNameMap: Record<string, string> = {
    bounce: "emojiBounce",
    spin: "emojiSpin",
    pulse: "emojiPulse",
    shake: "emojiShake",
    float: "emojiFloat",
    rubber: "emojiRubber",
  };

  return `${animKeyframe}

.emoji-wrap {
  width: ${totalSize}px;
  height: ${totalSize}px;
  border-radius: ${backgroundRadius}%;
  background: ${showBackground ? backgroundColor : "transparent"};
  box-shadow: ${showShadow ? "0 8px 40px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3)" : "none"};
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-svg {
  display: block;
}

${
  animationEnabled
    ? `.emoji-svg--animated {
  animation: ${animNameMap[animation]} ${animationDuration}ms ease-in-out infinite;
}`
    : ""
}
`;
}
