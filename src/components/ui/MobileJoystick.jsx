import React, { useRef, useState, useEffect, useCallback } from "react";
import { computeJoystickAxes, DEFAULT_JOYSTICK_CONFIG } from "../../services/joystickLogic";

/**
 * MobileJoystick
 * Lightweight, high-performance on-screen virtual joystick.
 *
 * Uses Pointer Events with PointerCapture for seamless touch tracking across
 * mobile Safari, Android Chrome, and touch laptops.
 *
 * @param {Object} props
 * @param {(vec: { x: number, y: number }) => void} props.onMove - Callback with normalized axes [-1, 1]
 * @param {boolean} [props.disabled=false] - When true, resets to neutral and blocks input
 * @param {number} [props.size=140] - Base diameter in pixels
 * @param {number} [props.knobSize=54] - Knob diameter in pixels
 */
export function MobileJoystick({
  onMove,
  disabled = false,
  size = 140,
  knobSize = 54
}) {
  const baseRef = useRef(null);
  const activePointerIdRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });

  const maxRadius = (size - knobSize) / 2;
  const prevDisabledRef = useRef(disabled);

  // When disabled changes from false to true, notify listener without cascading setState
  useEffect(() => {
    if (disabled && !prevDisabledRef.current) {
      activePointerIdRef.current = null;
      if (onMove) {
        onMove({ x: 0, y: 0 });
      }
    }
    prevDisabledRef.current = disabled;
  }, [disabled, onMove]);

  const resetJoystick = useCallback(() => {
    activePointerIdRef.current = null;
    setIsDragging(false);
    setKnobPos({ x: 0, y: 0 });
    if (onMove) {
      onMove({ x: 0, y: 0 });
    }
  }, [onMove]);

  // Handle window blur and visibility change to prevent stuck movement
  useEffect(() => {
    const handleReset = () => {
      resetJoystick();
    };

    window.addEventListener("blur", handleReset);
    document.addEventListener("visibilitychange", handleReset);
    window.addEventListener("orientationchange", handleReset);

    return () => {
      window.removeEventListener("blur", handleReset);
      document.removeEventListener("visibilitychange", handleReset);
      window.removeEventListener("orientationchange", handleReset);
    };
  }, [resetJoystick]);

  const effectiveKnob = disabled ? { x: 0, y: 0 } : knobPos;
  const effectiveDragging = disabled ? false : isDragging;

  const handlePointerDown = (e) => {
    if (disabled) return;
    if (activePointerIdRef.current !== null) return; // Only one pointer at a time

    if (e.target && e.target.setPointerCapture) {
      try {
        e.target.setPointerCapture(e.pointerId);
      } catch {
        // Fallback for older browsers
      }
    }

    activePointerIdRef.current = e.pointerId;
    setIsDragging(true);

    if (baseRef.current) {
      const rect = baseRef.current.getBoundingClientRect();
      const baseCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
      const axes = computeJoystickAxes(
        { x: e.clientX, y: e.clientY },
        baseCenter,
        maxRadius,
        DEFAULT_JOYSTICK_CONFIG.deadZone
      );
      setKnobPos({ x: axes.knobX, y: axes.knobY });
      if (onMove) {
        onMove({ x: axes.x, y: axes.y });
      }
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging || activePointerIdRef.current !== e.pointerId || disabled) return;

    if (baseRef.current) {
      const rect = baseRef.current.getBoundingClientRect();
      const baseCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
      const axes = computeJoystickAxes(
        { x: e.clientX, y: e.clientY },
        baseCenter,
        maxRadius,
        DEFAULT_JOYSTICK_CONFIG.deadZone
      );
      setKnobPos({ x: axes.knobX, y: axes.knobY });
      if (onMove) {
        onMove({ x: axes.x, y: axes.y });
      }
    }
  };

  const handlePointerUp = (e) => {
    if (activePointerIdRef.current === e.pointerId) {
      if (e.target && e.target.releasePointerCapture) {
        try {
          e.target.releasePointerCapture(e.pointerId);
        } catch {
          // Fallback
        }
      }
      resetJoystick();
    }
  };

  return (
    <div
      ref={baseRef}
      className="mobile-joystick"
      data-touch-ignore="true"
      role="group"
      aria-label="Virtual Movement Joystick"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        position: "absolute",
        left: "calc(var(--sal, 0px) + 24px)",
        bottom: "calc(var(--sab, 0px) + 24px)",
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: isDragging
          ? "radial-gradient(circle, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.92) 100%)"
          : "radial-gradient(circle, rgba(30, 41, 59, 0.65) 0%, rgba(15, 23, 42, 0.8) 100%)",
        border: isDragging
          ? "2px solid rgba(96, 165, 250, 0.7)"
          : "1.5px solid rgba(255, 255, 255, 0.22)",
        boxShadow: isDragging
          ? "0 10px 30px rgba(0, 0, 0, 0.6), 0 0 16px rgba(59, 130, 246, 0.35)"
          : "0 8px 24px rgba(0, 0, 0, 0.45)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        touchAction: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
        zIndex: 25,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0 : 1,
        pointerEvents: disabled ? "none" : "auto",
        transition: "opacity 0.2s ease, border-color 0.15s ease"
      }}
    >
      {/* Directional Indicator Hints */}
      <span
        style={{
          position: "absolute",
          top: "8px",
          fontSize: "10px",
          color: "rgba(255, 255, 255, 0.3)",
          pointerEvents: "none"
        }}
      >
        ▲
      </span>
      <span
        style={{
          position: "absolute",
          bottom: "8px",
          fontSize: "10px",
          color: "rgba(255, 255, 255, 0.3)",
          pointerEvents: "none"
        }}
      >
        ▼
      </span>
      <span
        style={{
          position: "absolute",
          left: "8px",
          fontSize: "10px",
          color: "rgba(255, 255, 255, 0.3)",
          pointerEvents: "none"
        }}
      >
        ◀
      </span>
      <span
        style={{
          position: "absolute",
          right: "8px",
          fontSize: "10px",
          color: "rgba(255, 255, 255, 0.3)",
          pointerEvents: "none"
        }}
      >
        ▶
      </span>

      {/* Center Reticle Ring */}
      <div
        style={{
          position: "absolute",
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          border: "1px dashed rgba(255, 255, 255, 0.15)",
          pointerEvents: "none"
        }}
      />

      {/* Movable Thumb Knob */}
      <div
        style={{
          width: `${knobSize}px`,
          height: `${knobSize}px`,
          borderRadius: "50%",
          background: effectiveDragging
            ? "radial-gradient(circle at 35% 35%, #60a5fa 0%, #2563eb 60%, #1d4ed8 100%)"
            : "radial-gradient(circle at 35% 35%, #3b82f6 0%, #1d4ed8 70%, #1e40af 100%)",
          border: effectiveDragging
            ? "2px solid rgba(255, 255, 255, 0.9)"
            : "2px solid rgba(255, 255, 255, 0.65)",
          boxShadow: effectiveDragging
            ? "0 4px 18px rgba(37, 99, 235, 0.7), inset 0 2px 4px rgba(255, 255, 255, 0.4)"
            : "0 4px 12px rgba(0, 0, 0, 0.45), inset 0 2px 4px rgba(255, 255, 255, 0.3)",
          transform: `translate(${effectiveKnob.x}px, ${effectiveKnob.y}px)`,
          transition: effectiveDragging ? "none" : "transform 0.16s cubic-bezier(0.18, 0.89, 0.32, 1.25)",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {/* Inner Knob Dot */}
        <div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.6)"
          }}
        />
      </div>
    </div>
  );
}

export default MobileJoystick;
