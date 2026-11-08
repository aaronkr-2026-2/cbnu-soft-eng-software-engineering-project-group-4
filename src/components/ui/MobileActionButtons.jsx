import React from "react";
import { t } from "../../services/i18n";

/**
 * MobileActionButtons
 * Floating action buttons on mobile screens providing touch equivalents for:
 * - Keyboard [E]: Door enter/exit or Item pickup (INTERACT)
 * - Keyboard [F]: NPC Dialogue (TALK)
 * - Keyboard [M]: Statistics & Progress modal (STATS)
 *
 * @param {Object} props
 * @param {string|null} [props.doorPrompt] - Currently active door prompt name
 * @param {string|null} [props.npcPrompt] - Currently active NPC prompt name
 * @param {Object|null} [props.itemPrompt] - Currently active item prompt
 * @param {() => void} props.onInteract - Action callback for door/item interaction (E)
 * @param {() => void} props.onTalk - Action callback for NPC dialogue (F)
 * @param {() => void} props.onToggleStats - Action callback for statistics (M)
 * @param {boolean} [props.disabled=false] - When true, disables buttons
 * @param {string} [props.interfaceLanguage="en"] - Language for accessibility labels
 */
export function MobileActionButtons({
  doorPrompt = null,
  npcPrompt = null,
  itemPrompt = null,
  onInteract,
  onTalk,
  onToggleStats,
  disabled = false,
  interfaceLanguage = "en"
}) {
  if (disabled) return null;

  const hasInteractable = Boolean(doorPrompt || itemPrompt);
  const hasNPC = Boolean(npcPrompt);

  return (
    <div
      className="mobile-action-buttons"
      data-touch-ignore="true"
      role="toolbar"
      aria-label="Mobile Gameplay Controls"
      style={{
        position: "absolute",
        right: "calc(var(--sar, 0px) + 20px)",
        bottom: "calc(var(--sab, 0px) + 24px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "12px",
        zIndex: 25,
        touchAction: "none",
        userSelect: "none",
        WebkitUserSelect: "none"
      }}
    >
      <style>{`
        @keyframes pulse-action {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.6); }
          70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        @keyframes pulse-talk {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.6); }
          70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
      `}</style>

      {/* Row with Stats Button (Small, secondary) */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <button
          type="button"
          onClick={onToggleStats}
          aria-label={t("hud.openStats", {}, interfaceLanguage) || "Statistics"}
          title="Statistics (M)"
          style={{
            width: "46px",
            height: "46px",
            minWidth: "46px",
            minHeight: "46px",
            borderRadius: "50%",
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1.5px solid rgba(168, 85, 247, 0.5)",
            color: "#d8b4fe",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 18px rgba(0, 0, 0, 0.45)",
            cursor: "pointer",
            transition: "transform 0.12s ease, background 0.15s ease"
          }}
          onPointerDown={(e) => {
            e.currentTarget.style.transform = "scale(0.92)";
          }}
          onPointerUp={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          onPointerCancel={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          📊
        </button>
      </div>

      {/* Primary Action Buttons Row */}
      <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
        {/* TALK BUTTON (F) */}
        <button
          type="button"
          onClick={onTalk}
          disabled={!hasNPC}
          aria-label={
            hasNPC
              ? t("prompts.talkToNpc", { npc: npcPrompt }, interfaceLanguage)
              : "Talk (F)"
          }
          title={hasNPC ? `Talk to ${npcPrompt}` : "No NPC nearby"}
          style={{
            width: "58px",
            height: "58px",
            minWidth: "58px",
            minHeight: "58px",
            borderRadius: "50%",
            background: hasNPC
              ? "radial-gradient(circle at 35% 35%, #3b82f6 0%, #1d4ed8 70%, #1e40af 100%)"
              : "rgba(30, 41, 59, 0.65)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: hasNPC
              ? "2px solid rgba(255, 255, 255, 0.9)"
              : "1.5px solid rgba(255, 255, 255, 0.18)",
            color: hasNPC ? "#fff" : "#94a3b8",
            fontSize: "22px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: hasNPC
              ? "0 8px 24px rgba(37, 99, 235, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.4)"
              : "0 6px 16px rgba(0, 0, 0, 0.35)",
            animation: hasNPC ? "pulse-talk 1.8s infinite" : "none",
            cursor: hasNPC ? "pointer" : "not-allowed",
            opacity: hasNPC ? 1 : 0.45,
            transition: "transform 0.12s ease, opacity 0.2s ease, background 0.2s ease"
          }}
          onPointerDown={(e) => {
            if (hasNPC) e.currentTarget.style.transform = "scale(0.92)";
          }}
          onPointerUp={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          onPointerCancel={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <span>💬</span>
          <span
            style={{
              fontSize: "9px",
              fontWeight: "700",
              letterSpacing: "0.5px",
              marginTop: "-2px"
            }}
          >
            {interfaceLanguage === "ko" ? "대화" : "TALK"}
          </span>
        </button>

        {/* INTERACT BUTTON (E) */}
        <button
          type="button"
          onClick={onInteract}
          disabled={!hasInteractable}
          aria-label={
            itemPrompt
              ? `Pick up ${itemPrompt.displayName || "item"}`
              : doorPrompt
                ? doorPrompt
                : "Interact (E)"
          }
          title={
            itemPrompt
              ? `Pick up ${itemPrompt.displayName || "item"}`
              : doorPrompt || "No door or item nearby"
          }
          style={{
            width: "62px",
            height: "62px",
            minWidth: "62px",
            minHeight: "62px",
            borderRadius: "50%",
            background: hasInteractable
              ? "radial-gradient(circle at 35% 35%, #22c55e 0%, #16a34a 70%, #15803d 100%)"
              : "rgba(30, 41, 59, 0.65)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: hasInteractable
              ? "2.5px solid rgba(255, 255, 255, 0.95)"
              : "1.5px solid rgba(255, 255, 255, 0.18)",
            color: hasInteractable ? "#fff" : "#94a3b8",
            fontSize: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: hasInteractable
              ? "0 10px 28px rgba(34, 197, 94, 0.65), inset 0 2px 4px rgba(255, 255, 255, 0.4)"
              : "0 6px 16px rgba(0, 0, 0, 0.35)",
            animation: hasInteractable ? "pulse-action 1.8s infinite" : "none",
            cursor: hasInteractable ? "pointer" : "not-allowed",
            opacity: hasInteractable ? 1 : 0.45,
            transition: "transform 0.12s ease, opacity 0.2s ease, background 0.2s ease"
          }}
          onPointerDown={(e) => {
            if (hasInteractable) e.currentTarget.style.transform = "scale(0.92)";
          }}
          onPointerUp={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          onPointerCancel={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <span>{itemPrompt ? "📦" : "🚪"}</span>
          <span
            style={{
              fontSize: "9px",
              fontWeight: "700",
              letterSpacing: "0.5px",
              marginTop: "-3px"
            }}
          >
            {itemPrompt
              ? (interfaceLanguage === "ko" ? "획득" : "GRAB")
              : doorPrompt?.startsWith("Exit")
                ? (interfaceLanguage === "ko" ? "퇴장" : "EXIT")
                : (interfaceLanguage === "ko" ? "입장" : "ENTER")}
          </span>
        </button>
      </div>
    </div>
  );
}

export default MobileActionButtons;
