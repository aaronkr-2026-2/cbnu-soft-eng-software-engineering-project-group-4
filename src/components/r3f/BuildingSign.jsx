import React, { useMemo, useEffect } from "react";
import * as THREE from "three";

/**
 * Reusable, lightweight, high-readability 3D building sign.
 * Features:
 * - High-readability canvas-rendered bilingual typography (English + Korean)
 * - Optimized 512x128 canvas texture (75% VRAM reduction compared to 1024x256)
 * - Automatic texture disposal on unmount to eliminate memory leaks
 * - Beveled trim rails and side end-caps matching the building's signature theme
 * - Rear wall-mount anchor brackets so the sign looks structurally anchored
 * - Overhead decorative lantern fixture with emissive glow
 * - 100% lightweight primitives (no GLB loading, 0 shadows)
 */
export function BuildingSign({
  title,
  subtitle,
  position = [0, 3.8, 0],
  rotation = [0, 0, 0],
  width = 4.0,
  height = 0.95,
  accentColor = "#1e3a8a",
  textColor = "#0f172a",
  subtitleColor = null,
  lampColor = "#fef08a"
}) {
  // Generate crisp, memory-optimized text texture (512 x 128)
  const signTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // 1. Crisp white signboard background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 512, 128);

    // 2. Signature accent border frame
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 7;
    ctx.strokeRect(4, 4, 504, 120);

    // 3. Top accent indicator bar
    ctx.fillStyle = accentColor;
    ctx.fillRect(10, 10, 492, 4);

    // 4. Large bold English building title
    ctx.fillStyle = textColor;
    ctx.font = "bold 38px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(title, 256, 50);

    // 5. Korean subtitle
    if (subtitle) {
      ctx.fillStyle = subtitleColor || accentColor;
      ctx.font = "bold 22px system-ui, -apple-system, sans-serif";
      ctx.fillText(subtitle, 256, 92);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, [title, subtitle, accentColor, textColor, subtitleColor]);

  // Clean up texture GPU memory when unmounted
  useEffect(() => {
    return () => {
      if (signTexture) signTexture.dispose();
    };
  }, [signTexture]);

  // Reusable materials
  const materials = useMemo(() => {
    return {
      board: new THREE.MeshStandardMaterial({ color: "#f8fafc", roughness: 0.35 }),
      trim: new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.4 }),
      brackets: new THREE.MeshStandardMaterial({ color: "#334155", roughness: 0.7 }),
      lampFixture: new THREE.MeshStandardMaterial({ color: "#475569", roughness: 0.5 }),
      lampGlow: new THREE.MeshStandardMaterial({
        color: "#ffffff",
        emissive: lampColor,
        emissiveIntensity: 0.8
      })
    };
  }, [accentColor, lampColor]);

  return (
    <group position={position} rotation={rotation}>
      {/* Rear wall mounting brackets (anchoring sign to the building facade) */}
      <mesh position={[-width * 0.35, 0, -0.09]} material={materials.brackets}>
        <boxGeometry args={[0.08, height * 0.65, 0.16]} />
      </mesh>
      <mesh position={[width * 0.35, 0, -0.09]} material={materials.brackets}>
        <boxGeometry args={[0.08, height * 0.65, 0.16]} />
      </mesh>

      {/* Main Backing Signboard */}
      <mesh material={materials.board}>
        <boxGeometry args={[width, height, 0.12]} />
      </mesh>

      {/* Top Trim Rail */}
      <mesh position={[0, height / 2 + 0.03, 0.01]} material={materials.trim}>
        <boxGeometry args={[width + 0.08, 0.07, 0.14]} />
      </mesh>

      {/* Bottom Trim Rail */}
      <mesh position={[0, -height / 2 - 0.03, 0.01]} material={materials.trim}>
        <boxGeometry args={[width + 0.08, 0.07, 0.14]} />
      </mesh>

      {/* Left End-cap Trim */}
      <mesh position={[-width / 2 - 0.03, 0, 0.01]} material={materials.trim}>
        <boxGeometry args={[0.06, height + 0.12, 0.14]} />
      </mesh>

      {/* Right End-cap Trim */}
      <mesh position={[width / 2 + 0.03, 0, 0.01]} material={materials.trim}>
        <boxGeometry args={[0.06, height + 0.12, 0.14]} />
      </mesh>

      {/* High-Resolution Printed Signboard Facade */}
      {signTexture && (
        <mesh position={[0, 0, 0.065]}>
          <planeGeometry args={[width - 0.12, height - 0.12]} />
          <meshBasicMaterial map={signTexture} />
        </mesh>
      )}

      {/* Overhead Gooseneck Lamp Fixture */}
      <group position={[0, height / 2 + 0.06, 0.05]}>
        {/* Horizontal mounting arm extending out */}
        <mesh position={[0, 0.22, 0.32]} material={materials.lampFixture}>
          <boxGeometry args={[0.05, 0.05, 0.58]} />
        </mesh>
        {/* Vertical drop stalk */}
        <mesh position={[0, 0.14, 0.58]} material={materials.lampFixture}>
          <boxGeometry args={[0.05, 0.16, 0.05]} />
        </mesh>
        {/* Lamp shade cowl */}
        <mesh position={[0, 0.06, 0.58]} material={materials.lampFixture}>
          <cylinderGeometry args={[0.12, 0.24, 0.1, 10]} />
        </mesh>
        {/* Warm emissive bulb glow panel facing downwards towards the sign */}
        <mesh position={[0, 0.01, 0.58]} material={materials.lampGlow}>
          <circleGeometry args={[0.14, 10]} />
        </mesh>
      </group>
    </group>
  );
}
