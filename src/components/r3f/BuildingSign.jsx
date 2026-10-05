import React, { useMemo } from "react";
import * as THREE from "three";

/**
 * Reusable, lightweight, high-readability 3D building sign.
 * Features:
 * - High-resolution canvas-rendered bilingual typography (English + Korean)
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
  // Generate high-resolution, crisp text texture (1024 x 256)
  const signTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // 1. Crisp white signboard background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1024, 256);

    // 2. Signature accent border frame
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 14;
    ctx.strokeRect(8, 8, 1008, 240);

    // 3. Top accent indicator bar
    ctx.fillStyle = accentColor;
    ctx.fillRect(20, 20, 984, 8);

    // 4. Large bold English building title
    ctx.fillStyle = textColor;
    ctx.font = "bold 76px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(title, 512, 100);

    // 5. Korean subtitle
    if (subtitle) {
      ctx.fillStyle = subtitleColor || accentColor;
      ctx.font = "bold 44px system-ui, -apple-system, sans-serif";
      ctx.fillText(subtitle, 512, 185);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, [title, subtitle, accentColor, textColor, subtitleColor]);

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

      {/* Left End-Cap */}
      <mesh position={[-width / 2 - 0.03, 0, 0.01]} material={materials.trim}>
        <boxGeometry args={[0.07, height + 0.13, 0.14]} />
      </mesh>

      {/* Right End-Cap */}
      <mesh position={[width / 2 + 0.03, 0, 0.01]} material={materials.trim}>
        <boxGeometry args={[0.07, height + 0.13, 0.14]} />
      </mesh>

      {/* Front Plaque with High-Contrast Canvas Texture */}
      {signTexture && (
        <mesh position={[0, 0, 0.065]}>
          <planeGeometry args={[width - 0.18, height - 0.18]} />
          <meshStandardMaterial map={signTexture} roughness={0.25} />
        </mesh>
      )}

      {/* Overhead Decorative Lantern Lamp */}
      <group position={[0, height / 2 + 0.15, 0.16]}>
        {/* Support arm */}
        <mesh position={[0, 0.06, -0.08]} material={materials.lampFixture}>
          <boxGeometry args={[0.04, 0.04, 0.16]} />
        </mesh>
        {/* Lamp Hood */}
        <mesh position={[0, 0.05, 0]} material={materials.lampFixture}>
          <cylinderGeometry args={[0.08, 0.14, 0.06, 12]} />
        </mesh>
        {/* Glowing bulb */}
        <mesh position={[0, 0, 0]} material={materials.lampGlow}>
          <sphereGeometry args={[0.06, 12, 12]} />
        </mesh>
      </group>
    </group>
  );
}
