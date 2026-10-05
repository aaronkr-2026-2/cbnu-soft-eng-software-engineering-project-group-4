import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Stylized low-poly Career Counselor James
 * Friendly, professional career consultant at the village career center (취업지원센터).
 * Dressed in a sharp charcoal-navy blazer, crisp collared dress shirt, amber-gold necktie,
 * tailored dark slate trousers, polished brown oxford shoes, and a gold "JAMES" counselor badge.
 * Subtly animated with gentle breathing, small head movements, and conversational hand gestures.
 */
function CounselorJames({ isTalking = false }) {
  const headRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (headRef.current) {
      headRef.current.position.y = 1.38 + Math.sin(t * 2) * 0.005;
      if (isTalking) {
        headRef.current.rotation.y = Math.sin(t * 4.8) * 0.08;
        headRef.current.rotation.x = Math.sin(t * 6.5) * 0.04;
      } else {
        headRef.current.rotation.y = Math.sin(t * 0.8) * 0.03;
        headRef.current.rotation.x = 0;
      }
    }
    if (rightArmRef.current && isTalking) {
      rightArmRef.current.rotation.x = -0.35 + Math.sin(t * 5.5) * 0.15;
    }
    if (leftArmRef.current && isTalking) {
      leftArmRef.current.rotation.x = -0.35 - Math.sin(t * 5.5) * 0.12;
    }
  });

  return (
    <group position={[14.4, 0, 35.2]}>
      {/* Lower Body / Tailored Trousers */}
      <mesh position={[-0.1, 0.44, 0]}>
        <cylinderGeometry args={[0.08, 0.09, 0.86, 12]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>
      <mesh position={[0.1, 0.44, 0]}>
        <cylinderGeometry args={[0.08, 0.09, 0.86, 12]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>

      {/* Brown Oxford Dress Shoes */}
      <mesh position={[-0.1, 0.04, 0.04]}>
        <boxGeometry args={[0.12, 0.08, 0.2]} />
        <meshStandardMaterial color="#451a03" roughness={0.35} />
      </mesh>
      <mesh position={[0.1, 0.04, 0.04]}>
        <boxGeometry args={[0.12, 0.08, 0.2]} />
        <meshStandardMaterial color="#451a03" roughness={0.35} />
      </mesh>

      {/* Torso / Navy Blazer & White Shirt */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.42, 0.5, 0.26]} />
        <meshStandardMaterial color="#1e293b" roughness={0.65} />
      </mesh>

      {/* White Dress Shirt V-Neck Inset */}
      <mesh position={[0, 1.14, 0.132]}>
        <planeGeometry args={[0.16, 0.26]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.5} />
      </mesh>

      {/* Amber/Gold Silk Necktie */}
      <mesh position={[0, 1.08, 0.134]}>
        <boxGeometry args={[0.05, 0.26, 0.01]} />
        <meshStandardMaterial color="#d97706" roughness={0.4} />
      </mesh>

      {/* Gold Counselor Name Badge ("JAMES") */}
      <mesh position={[-0.14, 1.2, 0.134]}>
        <boxGeometry args={[0.08, 0.035, 0.01]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Left Arm & Hand */}
      <group ref={leftArmRef} position={[-0.26, 1.26, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.06, 0.055, 0.44, 10]} />
          <meshStandardMaterial color="#1e293b" roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.46, 0]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.6} />
        </mesh>
      </group>

      {/* Right Arm & Hand */}
      <group ref={rightArmRef} position={[0.26, 1.26, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.06, 0.055, 0.44, 10]} />
          <meshStandardMaterial color="#1e293b" roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.46, 0]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.6} />
        </mesh>
      </group>

      {/* Head, Hair & Professional Spectacles */}
      <group ref={headRef} position={[0, 1.38, 0]}>
        {/* Head */}
        <mesh position={[0, 0.12, 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.6} />
        </mesh>

        {/* Professional Dark Brown Styled Hair */}
        <mesh position={[0, 0.21, -0.01]}>
          <sphereGeometry args={[0.138, 14, 14]} />
          <meshStandardMaterial color="#292524" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.22, 0.06]}>
          <boxGeometry args={[0.18, 0.06, 0.1]} />
          <meshStandardMaterial color="#292524" roughness={0.8} />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.045, 0.13, 0.12]}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.045, 0.13, 0.12]}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>

        {/* Friendly Counselor Smile */}
        <mesh position={[0, 0.075, 0.122]}>
          <boxGeometry args={[0.045, 0.012, 0.01]} />
          <meshStandardMaterial color="#b45309" />
        </mesh>

        {/* Gold Frame Eyeglasses */}
        <mesh position={[-0.045, 0.13, 0.132]}>
          <ringGeometry args={[0.022, 0.028, 12]} />
          <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.045, 0.13, 0.132]}>
          <ringGeometry args={[0.022, 0.028, 12]} />
          <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.13, 0.132]}>
          <boxGeometry args={[0.028, 0.006, 0.004]} />
          <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Modern Ergonomic Mesh Office Chair
 */
function OfficeChair({ position, rotation = [0, 0, 0], color = "#0f172a" }) {
  return (
    <group position={position} rotation={rotation}>
      {/* 5-Star Caster Base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.04, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Central Gas Lift Column */}
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.36, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Contoured Seat Cushion */}
      <mesh position={[0, 0.44, 0]}>
        <boxGeometry args={[0.46, 0.08, 0.44]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* High Mesh Backrest */}
      <mesh position={[0, 0.78, -0.2]}>
        <boxGeometry args={[0.42, 0.6, 0.05]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Left & Right Armrests */}
      <mesh position={[-0.22, 0.58, -0.04]}>
        <boxGeometry args={[0.05, 0.2, 0.24]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>
      <mesh position={[0.22, 0.58, -0.04]}>
        <boxGeometry args={[0.05, 0.2, 0.24]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>
    </group>
  );
}

/**
 * Upholstered Guest / Visitor Chair
 */
function VisitorChair({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* 4 Sleek Black Steel Legs */}
      {[
        [-0.18, 0.22, -0.16],
        [0.18, 0.22, -0.16],
        [-0.18, 0.22, 0.16],
        [0.18, 0.22, 0.16]
      ].map((p, idx) => (
        <mesh key={`leg-${idx}`} position={p}>
          <cylinderGeometry args={[0.018, 0.015, 0.44, 8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      {/* Cushioned Seat */}
      <mesh position={[0, 0.44, 0]}>
        <boxGeometry args={[0.44, 0.07, 0.42]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>
      {/* Curved Padded Backrest */}
      <mesh position={[0, 0.72, -0.18]}>
        <boxGeometry args={[0.42, 0.48, 0.05]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>
    </group>
  );
}

/**
 * Potted Ficus Office Plant
 */
function OfficePlant({ position }) {
  return (
    <group position={position}>
      {/* Ceramic Planter Pot */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.22, 0.17, 0.44, 12]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
      </mesh>
      {/* Gold Rim Accent */}
      <mesh position={[0, 0.44, 0]}>
        <torusGeometry args={[0.22, 0.015, 8, 16]} />
        <meshStandardMaterial color="#d97706" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.04, 10]} />
        <meshStandardMaterial color="#3f2e18" roughness={0.9} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.68, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.52, 8]} />
        <meshStandardMaterial color="#713f12" roughness={0.8} />
      </mesh>
      {/* Lush Foliage Canopy */}
      <mesh position={[0, 0.98, 0]}>
        <sphereGeometry args={[0.28, 10, 10]} />
        <meshStandardMaterial color="#15803d" roughness={0.7} />
      </mesh>
      <mesh position={[0.08, 1.18, 0.06]}>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshStandardMaterial color="#16a34a" roughness={0.75} />
      </mesh>
      <mesh position={[-0.08, 1.14, -0.06]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#22c55e" roughness={0.8} />
      </mesh>
    </group>
  );
}

/**
 * CareerCenter Interior Component
 * Renders ONLY when currentLocation === "CareerCenter".
 * Believable Korean neighborhood 취업지원센터 with Career Counselor James NPC,
 * counselor executive desk, consultation round table, waiting area,
 * job vacancy bulletin, interview tips board, and career flyers.
 */
export function CareerCenter({ isTalking = false, currentLocation = "outside" }) {
  const isInside = currentLocation === "CareerCenter";

  // Job Vacancy & Information Notice Board (1024x512 canvas texture)
  const jobBoardTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1024, 512);

    // Border with amber header stripe
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, 1014, 502);

    ctx.fillStyle = "#b45309";
    ctx.fillRect(5, 5, 1014, 76);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 30px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("💼 VILLAGE JOB & CAREER OPPORTUNITIES (채용 공고)", 36, 52);

    ctx.fillStyle = "#fef3c7";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("Weekly Job Board • Updated Today", 980, 52);

    // 4 Columns / Categories
    const categories = [
      {
        title: "1. PART-TIME JOBS",
        kr: "아르바이트",
        color: "#d97706",
        items: [
          "• Village Cafe Barista (Weekend / 4h)",
          "• Supermarket Cashier (Mon-Fri 2PM)",
          "• Community Library Assistant",
          "• Local Bakery Morning Baker"
        ]
      },
      {
        title: "2. FULL-TIME JOBS",
        kr: "정규직 채용",
        color: "#0369a1",
        items: [
          "• Office Administrative Assistant",
          "• Village Logistics Coordinator",
          "• Customer Service Specialist",
          "• Junior Software Support Tech"
        ]
      },
      {
        title: "3. INTERNSHIPS",
        kr: "인턴십",
        color: "#059669",
        items: [
          "• Global Trade & Translation Intern",
          "• Municipal Civic Project Aide",
          "• Education Tech Content Assistant",
          "• Digital Media Design Trainee"
        ]
      },
      {
        title: "4. VOCATIONAL TRAINING",
        kr: "직업 훈련 과정",
        color: "#7c3aed",
        items: [
          "• Practical Business English Speaking",
          "• Resume & Cover Letter Coaching",
          "• Job Interview Masterclass (Sat 2PM)",
          "• Office Automation & Excel Certification"
        ]
      }
    ];

    categories.forEach((cat, idx) => {
      const colX = 36 + (idx % 2) * 480;
      const colY = idx < 2 ? 110 : 280;

      ctx.fillStyle = cat.color;
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`${cat.title} [${cat.kr}]`, colX, colY);

      ctx.fillStyle = "#334155";
      ctx.font = "16px sans-serif";
      cat.items.forEach((item, i) => {
        ctx.fillText(item, colX + 12, colY + 30 + i * 26);
      });
    });

    // Bottom Consultation Banner
    ctx.fillStyle = "#fffbeb";
    ctx.fillRect(36, 435, 952, 60);
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.strokeRect(36, 435, 952, 60);

    ctx.fillStyle = "#b45309";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("📢 Free 1-on-1 Consultation: Speak with Counselor James for resume checks & mock interviews!", 56, 472);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Interview Tips Board (512x512 canvas texture)
  const interviewTipsTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, 512, 512);

    // Amber Accent Header
    ctx.fillStyle = "#d97706";
    ctx.fillRect(0, 0, 512, 68);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🎯 INTERVIEW SUCCESS TIPS", 256, 42);

    const tips = [
      {
        num: "1",
        title: "INTRODUCE YOURSELF",
        kr: "자신감 있는 자기소개",
        desc: "Prepare a clear 1-minute intro highlighting your experience and enthusiasm."
      },
      {
        num: "2",
        title: "SPEAK CLEARLY",
        kr: "정확하고 명확한 어조",
        desc: "Speak naturally using polite phrasing. It is okay to pause and think."
      },
      {
        num: "3",
        title: "ASK QUESTIONS",
        kr: "적극적인 질문하기",
        desc: "Ask about team goals, training opportunities, and daily work culture."
      },
      {
        num: "4",
        title: "THANK THE INTERVIEWER",
        kr: "정중한 감사 인사",
        desc: "Always express polite gratitude for their time and valuable consideration."
      }
    ];

    tips.forEach((t, idx) => {
      const topY = 100 + idx * 95;

      // Circle badge
      ctx.fillStyle = "#d97706";
      ctx.beginPath();
      ctx.arc(44, topY + 18, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(t.num, 44, topY + 24);

      ctx.textAlign = "left";
      ctx.fillStyle = "#fef08a";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(`${t.title} (${t.kr})`, 76, topY + 16);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "14px sans-serif";
      ctx.fillText(t.desc, 76, topY + 40);
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Main Bilingual Wall Signboard ("VILLAGE CAREER CENTER" / "마을 취업지원센터")
  const mainSignTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 512, 256);

    // Warm Amber Top Stripe
    ctx.fillStyle = "#d97706";
    ctx.fillRect(0, 0, 512, 24);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("VILLAGE CAREER CENTER", 256, 100);

    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText("마을 취업지원센터", 256, 150);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px sans-serif";
    ctx.fillText("Job Placement • Resume Coaching • Interview Prep", 256, 195);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Secondary Signboard ("JOB & CAREER SUPPORT" / "취업 및 진로 상담")
  const secondarySignTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(0, 0, 512, 18);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 30px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("JOB & CAREER SUPPORT", 256, 96);

    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("취업 및 진로 상담", 256, 146);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "16px sans-serif";
    ctx.fillText("Walk-in Counseling & Registration Desk", 256, 192);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Vocational Training & Skills Poster (256x512 canvas texture)
  const trainingPosterTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, 256, 512);

    ctx.fillStyle = "#d97706";
    ctx.fillRect(0, 0, 256, 50);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("CAREER WORKSHOPS", 128, 30);

    ctx.fillStyle = "#b45309";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("Professional Growth Series", 128, 75);

    ctx.fillStyle = "#334155";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "left";
    const workshops = [
      "• Resume Formatting (Mon)",
      "• Mock Interview Practice (Wed)",
      "• Business English Vocabulary",
      "• LinkedIn & Portfolio Setup",
      "• Salary & Benefits Guide",
      "• Youth Career Mentoring"
    ];
    workshops.forEach((ws, idx) => {
      ctx.fillText(ws, 16, 115 + idx * 40);
    });

    // Footer
    ctx.fillStyle = "#fef3c7";
    ctx.fillRect(16, 380, 224, 90);
    ctx.fillStyle = "#92400e";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("All Sessions Free of Charge", 128, 410);
    ctx.fillText("Ask James for schedule details!", 128, 435);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  if (!isInside) return null;

  return (
    <group>
      {/* ============================================================ */}
      {/* 1. WARM OFFICE LIGHTING (Max 2 Lightweight Lights)           */}
      {/* ============================================================ */}
      <ambientLight intensity={0.96} color="#fdfbf7" />
      <pointLight position={[14.4, 2.8, 36.1]} intensity={1.15} distance={9} color="#fffbeb" />

      {/* ============================================================ */}
      {/* 2. FLOOR & CEILING                                           */}
      {/* ============================================================ */}
      {/* Warm Light Hardwood Floor (X: [12.1, 16.7], Z: [34.2, 37.9]) */}
      <mesh position={[14.4, 0.01, 36.05]}>
        <boxGeometry args={[4.6, 0.02, 3.7]} />
        <meshStandardMaterial color="#d4a373" roughness={0.65} />
      </mesh>

      {/* Center Pathway Runner Accent */}
      <mesh position={[14.4, 0.015, 36.35]}>
        <boxGeometry args={[1.4, 0.01, 2.7]} />
        <meshStandardMaterial color="#b45309" roughness={0.8} />
      </mesh>

      {/* Entrance Welcome Mat */}
      <mesh position={[14.4, 0.02, 37.35]}>
        <boxGeometry args={[1.2, 0.01, 0.8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Ceiling with Warm Light Panel Recesses */}
      <mesh position={[14.4, 3.2, 36.05]}>
        <boxGeometry args={[4.6, 0.05, 3.7]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[14.4, 3.18, 35.2]}>
        <boxGeometry args={[2.0, 0.02, 0.6]} />
        <meshStandardMaterial color="#ffffff" emissive="#fef3c7" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[14.4, 3.18, 36.8]}>
        <boxGeometry args={[2.0, 0.02, 0.6]} />
        <meshStandardMaterial color="#ffffff" emissive="#fef3c7" emissiveIntensity={0.8} />
      </mesh>

      {/* ============================================================ */}
      {/* 3. FOUR WALLS                                                */}
      {/* ============================================================ */}
      {/* South Wall (Behind Counselor James, Z = 34.2) */}
      <mesh position={[14.4, 1.6, 34.2]}>
        <boxGeometry args={[4.6, 3.2, 0.08]} />
        <meshStandardMaterial color="#faf8f5" roughness={0.85} />
      </mesh>
      {/* South Wainscot Trim Panel (Warm Amber) */}
      <mesh position={[14.4, 0.45, 34.23]}>
        <boxGeometry args={[4.6, 0.9, 0.03]} />
        <meshStandardMaterial color="#b45309" roughness={0.7} />
      </mesh>

      {/* West Wall (X = 12.1) */}
      <mesh position={[12.1, 1.6, 36.05]}>
        <boxGeometry args={[0.08, 3.2, 3.7]} />
        <meshStandardMaterial color="#faf8f5" roughness={0.85} />
      </mesh>
      {/* West Wainscot Trim Panel */}
      <mesh position={[12.13, 0.45, 36.05]}>
        <boxGeometry args={[0.03, 0.9, 3.7]} />
        <meshStandardMaterial color="#b45309" roughness={0.7} />
      </mesh>

      {/* East Wall (X = 16.7) */}
      <mesh position={[16.7, 1.6, 36.05]}>
        <boxGeometry args={[0.08, 3.2, 3.7]} />
        <meshStandardMaterial color="#faf8f5" roughness={0.85} />
      </mesh>
      {/* East Wainscot Trim Panel */}
      <mesh position={[16.67, 0.45, 36.05]}>
        <boxGeometry args={[0.03, 0.9, 3.7]} />
        <meshStandardMaterial color="#b45309" roughness={0.7} />
      </mesh>

      {/* North Wall (Entrance/Exit Facade, Z = 37.9) */}
      {/* Left Wall Segment */}
      <mesh position={[12.9, 1.6, 37.9]}>
        <boxGeometry args={[1.6, 3.2, 0.08]} />
        <meshStandardMaterial color="#faf8f5" roughness={0.85} />
      </mesh>
      {/* Right Wall Segment */}
      <mesh position={[15.9, 1.6, 37.9]}>
        <boxGeometry args={[1.6, 3.2, 0.08]} />
        <meshStandardMaterial color="#faf8f5" roughness={0.85} />
      </mesh>
      {/* Header Above Doorway */}
      <mesh position={[14.4, 2.75, 37.9]}>
        <boxGeometry args={[1.4, 0.9, 0.08]} />
        <meshStandardMaterial color="#faf8f5" roughness={0.85} />
      </mesh>

      {/* Transparent Glass Exit Doors with Stainless Handles */}
      <group position={[14.4, 1.15, 37.85]}>
        <mesh position={[-0.34, 0, 0]}>
          <boxGeometry args={[0.62, 2.2, 0.04]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.35} />
        </mesh>
        <mesh position={[0.34, 0, 0]}>
          <boxGeometry args={[0.62, 2.2, 0.04]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.35} />
        </mesh>
        {/* Door Frames */}
        <mesh position={[-0.34, 0, 0]}>
          <boxGeometry args={[0.66, 2.24, 0.02]} />
          <meshStandardMaterial color="#1e293b" wireframe />
        </mesh>
        <mesh position={[0.34, 0, 0]}>
          <boxGeometry args={[0.66, 2.24, 0.02]} />
          <meshStandardMaterial color="#1e293b" wireframe />
        </mesh>
        {/* Stainless Steel Pull Handles */}
        <mesh position={[-0.08, 0, -0.035]}>
          <cylinderGeometry args={[0.015, 0.015, 0.45, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.08, 0, -0.035]}>
          <cylinderGeometry args={[0.015, 0.015, 0.45, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 4. COUNSELOR STATION & JAMES NPC                             */}
      {/* ============================================================ */}
      {/* Career Counselor James NPC */}
      <CounselorJames isTalking={isTalking} />

      {/* Counselor Executive Desk */}
      <group position={[14.4, 0, 35.7]}>
        {/* Main Desktop (Warm Oak finish) */}
        <mesh position={[0, 0.74, 0]}>
          <boxGeometry args={[1.8, 0.06, 0.8]} />
          <meshStandardMaterial color="#d4a373" roughness={0.5} />
        </mesh>
        {/* Front Modesty Panel (Dark Slate with Gold line) */}
        <mesh position={[0, 0.38, 0.36]}>
          <boxGeometry args={[1.76, 0.68, 0.04]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.38, 0.382]}>
          <boxGeometry args={[1.7, 0.02, 0.01]} />
          <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Left & Right Desk Pedestals */}
        <mesh position={[-0.75, 0.36, 0]}>
          <boxGeometry args={[0.26, 0.7, 0.72]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        <mesh position={[0.75, 0.36, 0]}>
          <boxGeometry args={[0.26, 0.7, 0.72]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>

        {/* Desktop Computer Monitor */}
        <group position={[-0.45, 0.77, -0.1]}>
          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[0.18, 0.02, 0.14]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
            <meshStandardMaterial color="#334155" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <boxGeometry args={[0.42, 0.28, 0.02]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.24, 0.012]}>
            <planeGeometry args={[0.39, 0.25]} />
            <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={0.4} />
          </mesh>
        </group>

        {/* Counselor Slim Laptop */}
        <group position={[0.0, 0.77, -0.05]} rotation={[0, -0.1, 0]}>
          <mesh position={[0, 0.005, 0]}>
            <boxGeometry args={[0.32, 0.012, 0.22]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.11, -0.1]} rotation={[-0.25, 0, 0]}>
            <boxGeometry args={[0.32, 0.2, 0.01]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.11, -0.094]} rotation={[-0.25, 0, 0]}>
            <planeGeometry args={[0.29, 0.17]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.5} />
          </mesh>
        </group>

        {/* Keyboard & Mouse */}
        <mesh position={[-0.45, 0.775, 0.12]}>
          <boxGeometry args={[0.32, 0.01, 0.12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </mesh>
        <mesh position={[-0.22, 0.775, 0.12]}>
          <boxGeometry args={[0.06, 0.012, 0.09]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>

        {/* Resume Folders & Document Trays */}
        <group position={[0.5, 0.77, 0.05]}>
          <mesh position={[0, 0.03, 0]}>
            <boxGeometry args={[0.26, 0.06, 0.32]} />
            <meshStandardMaterial color="#475569" roughness={0.5} />
          </mesh>
          {/* Blue, Amber, Green Folders */}
          <mesh position={[0, 0.07, 0]}>
            <boxGeometry args={[0.23, 0.012, 0.3]} />
            <meshStandardMaterial color="#0284c7" roughness={0.4} />
          </mesh>
          <mesh position={[0.01, 0.085, 0.01]}>
            <boxGeometry args={[0.23, 0.012, 0.3]} />
            <meshStandardMaterial color="#d97706" roughness={0.4} />
          </mesh>
          <mesh position={[-0.01, 0.1, -0.01]}>
            <boxGeometry args={[0.23, 0.012, 0.3]} />
            <meshStandardMaterial color="#16a34a" roughness={0.4} />
          </mesh>
        </group>

        {/* Desk Signboard ("JAMES • CAREER COUNSELOR") */}
        <group position={[-0.1, 0.78, 0.3]}>
          <mesh>
            <boxGeometry args={[0.24, 0.045, 0.03]} />
            <meshStandardMaterial color="#78350f" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.016]}>
            <planeGeometry args={[0.22, 0.035]} />
            <meshStandardMaterial color="#fef08a" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* Counselor Executive Chair */}
      <OfficeChair position={[14.4, 0, 35.0]} rotation={[0, 0, 0]} color="#0f172a" />

      {/* Visitor Consultation Chair (in front of desk) */}
      <VisitorChair position={[14.4, 0, 36.4]} rotation={[0, Math.PI, 0]} />

      {/* ============================================================ */}
      {/* 5. SMALL INTERVIEW / COUNSELING TABLE (West Side)            */}
      {/* ============================================================ */}
      <group position={[12.7, 0, 36.1]}>
        {/* Round Consultation Table */}
        <mesh position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.04, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.36, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.68, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.03, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Table Pen Stand & Notebook */}
        <mesh position={[0.08, 0.745, -0.05]}>
          <cylinderGeometry args={[0.025, 0.02, 0.06, 8]} />
          <meshStandardMaterial color="#d97706" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[-0.08, 0.745, 0.05]}>
          <boxGeometry args={[0.18, 0.01, 0.24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>

        {/* 2 Interview Consultation Chairs */}
        <VisitorChair position={[0, 0, -0.55]} rotation={[0, 0, 0]} />
        <VisitorChair position={[0, 0, 0.55]} rotation={[0, Math.PI, 0]} />
      </group>

      {/* ============================================================ */}
      {/* 6. WAITING AREA & BROCHURE RACK (East Side)                  */}
      {/* ============================================================ */}
      {/* Tandem Upholstered Waiting Chairs */}
      <group position={[16.2, 0, 36.3]}>
        {/* Steel Bench Support Frame */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.48, 0.04, 1.4]} />
          <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Legs */}
        <mesh position={[0, 0.1, -0.6]}>
          <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 0.1, 0.6]}>
          <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>

        {/* 2 Padded Navy Waiting Seats */}
        {[-0.35, 0.35].map((zPos, idx) => (
          <group key={`wait-seat-${idx}`} position={[0, 0.25, zPos]}>
            <mesh position={[0, 0.16, 0]}>
              <boxGeometry args={[0.44, 0.08, 0.44]} />
              <meshStandardMaterial color="#1e293b" roughness={0.6} />
            </mesh>
            <mesh position={[0.2, 0.46, 0]}>
              <boxGeometry args={[0.06, 0.52, 0.44]} />
              <meshStandardMaterial color="#1e293b" roughness={0.6} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Small Waiting Coffee Table with Magazines */}
      <group position={[16.2, 0, 35.1]}>
        <mesh position={[0, 0.32, 0]}>
          <boxGeometry args={[0.42, 0.04, 0.55]} />
          <meshStandardMaterial color="#d4a373" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.34, 0.3, 0.45]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        {/* Magazine stack */}
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[0.22, 0.02, 0.3]} />
          <meshStandardMaterial color="#e11d48" roughness={0.4} />
        </mesh>
        <mesh position={[0.02, 0.365, 0.02]}>
          <boxGeometry args={[0.22, 0.015, 0.28]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} />
        </mesh>
      </group>

      {/* Brochure Display Rack for Career Guides */}
      <group position={[16.35, 0, 34.45]}>
        {/* Stand Backing */}
        <mesh position={[0, 0.7, 0]} rotation={[0, 0, 0.08]}>
          <boxGeometry args={[0.04, 1.3, 0.48]} />
          <meshStandardMaterial color="#475569" roughness={0.4} />
        </mesh>
        {/* 3 Tier Brochure Pockets */}
        {[0.4, 0.7, 1.0].map((y, idx) => (
          <group key={`brochure-${idx}`} position={[-0.04, y, 0]}>
            <mesh>
              <boxGeometry args={[0.08, 0.16, 0.44]} />
              <meshStandardMaterial color="#0f172a" roughness={0.3} />
            </mesh>
            <mesh position={[-0.02, 0.02, -0.1]}>
              <boxGeometry args={[0.02, 0.18, 0.1]} />
              <meshStandardMaterial color="#d97706" />
            </mesh>
            <mesh position={[-0.02, 0.02, 0.1]}>
              <boxGeometry args={[0.02, 0.18, 0.1]} />
              <meshStandardMaterial color="#2563eb" />
            </mesh>
          </group>
        ))}
      </group>

      {/* ============================================================ */}
      {/* 7. STORAGE, PRINTER & BOOKSHELF                              */}
      {/* ============================================================ */}
      {/* Credenza & Laser Printer Behind James on South Wall */}
      <group position={[12.9, 0, 34.5]}>
        {/* Credenza Cabinet */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.9, 0.8, 0.42]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.81, 0]}>
          <boxGeometry args={[0.94, 0.03, 0.45]} />
          <meshStandardMaterial color="#d4a373" roughness={0.5} />
        </mesh>
        {/* Laser Printer */}
        <group position={[0, 0.94, 0]}>
          <mesh>
            <boxGeometry args={[0.42, 0.22, 0.32]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
          {/* Paper Output Tray */}
          <mesh position={[0, 0.02, 0.18]}>
            <boxGeometry args={[0.26, 0.03, 0.14]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.5} />
          </mesh>
          {/* Status LED */}
          <mesh position={[-0.14, 0.06, 0.162]}>
            <sphereGeometry args={[0.01, 8, 8]} />
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.8} />
          </mesh>
        </group>
      </group>

      {/* Tall Dual-Door Administrative Filing Cabinet */}
      <group position={[15.6, 0, 34.45]}>
        <mesh position={[0, 0.95, 0]}>
          <boxGeometry args={[0.7, 1.9, 0.44]} />
          <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.2} />
        </mesh>
        {/* Two Doors */}
        <mesh position={[-0.17, 0.95, 0.225]}>
          <boxGeometry args={[0.32, 1.84, 0.02]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        <mesh position={[0.17, 0.95, 0.225]}>
          <boxGeometry args={[0.32, 1.84, 0.02]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        {/* Chrome Handles */}
        <mesh position={[-0.04, 0.95, 0.245]}>
          <cylinderGeometry args={[0.01, 0.01, 0.22, 8]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.04, 0.95, 0.245]}>
          <cylinderGeometry args={[0.01, 0.01, 0.22, 8]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Career Guidance Bookshelf */}
      <group position={[12.35, 0, 34.9]}>
        {/* Bookshelf Outer Casing */}
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[0.26, 1.7, 0.6]} />
          <meshStandardMaterial color="#d4a373" roughness={0.6} />
        </mesh>
        {/* Shelves with Colorful Binders & Books */}
        {[
          { pos: [0.02, 0.45, -0.15], color: "#0284c7", w: 0.14 },
          { pos: [0.02, 0.45, 0.0], color: "#d97706", w: 0.16 },
          { pos: [0.02, 0.45, 0.15], color: "#16a34a", w: 0.12 },
          { pos: [0.02, 0.85, -0.12], color: "#7c3aed", w: 0.15 },
          { pos: [0.02, 0.85, 0.08], color: "#e11d48", w: 0.18 },
          { pos: [0.02, 1.25, -0.05], color: "#0f172a", w: 0.22 }
        ].map((book, idx) => (
          <mesh key={`career-book-${idx}`} position={book.pos}>
            <boxGeometry args={[0.22, 0.24, book.w]} />
            <meshStandardMaterial color={book.color} roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* Analog Wall Clock on South Wall */}
      <group position={[14.4, 2.5, 34.25]}>
        {/* Wooden Frame */}
        <mesh>
          <cylinderGeometry args={[0.2, 0.2, 0.03, 20]} />
          <meshStandardMaterial color="#78350f" roughness={0.5} />
        </mesh>
        {/* Dial Face */}
        <mesh position={[0, 0, 0.018]}>
          <cylinderGeometry args={[0.17, 0.17, 0.01, 20]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        {/* Hour & Minute Hands */}
        <mesh position={[0, 0.04, 0.026]}>
          <boxGeometry args={[0.014, 0.09, 0.005]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.04, 0, 0.026]} rotation={[0, 0, -Math.PI / 3]}>
          <boxGeometry args={[0.01, 0.12, 0.005]} />
          <meshStandardMaterial color="#d97706" />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 8. SIGNBOARDS, JOB BOARD & INTERVIEW TIPS                    */}
      {/* ============================================================ */}
      {/* Main Bilingual Wall Signboard ("VILLAGE CAREER CENTER" / "마을 취업지원센터") */}
      {mainSignTexture && (
        <group position={[14.4, 2.05, 34.25]}>
          <mesh>
            <boxGeometry args={[1.6, 0.72, 0.02]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[1.56, 0.68]} />
            <meshBasicMaterial map={mainSignTexture} />
          </mesh>
        </group>
      )}

      {/* Secondary Signboard on East Wall ("JOB & CAREER SUPPORT" / "취업 및 진로 상담") */}
      {secondarySignTexture && (
        <group position={[16.66, 2.1, 35.8]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh>
            <boxGeometry args={[1.3, 0.65, 0.02]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[1.26, 0.61]} />
            <meshBasicMaterial map={secondarySignTexture} />
          </mesh>
        </group>
      )}

      {/* Job Opportunities Notice Board on West Wall (1024x512) */}
      {jobBoardTexture && (
        <group position={[12.14, 1.85, 36.6]} rotation={[0, Math.PI / 2, 0]}>
          <mesh>
            <boxGeometry args={[1.8, 1.0, 0.02]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[1.76, 0.96]} />
            <meshBasicMaterial map={jobBoardTexture} />
          </mesh>
        </group>
      )}

      {/* Interview Success Tips Board on East Wall (512x512) */}
      {interviewTipsTexture && (
        <group position={[16.66, 1.85, 37.1]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh>
            <boxGeometry args={[1.0, 1.0, 0.02]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[0.96, 0.96]} />
            <meshBasicMaterial map={interviewTipsTexture} />
          </mesh>
        </group>
      )}

      {/* Vocational Training Workshops Poster on West Wall (256x512) */}
      {trainingPosterTexture && (
        <group position={[12.14, 1.85, 35.4]} rotation={[0, Math.PI / 2, 0]}>
          <mesh>
            <boxGeometry args={[0.65, 1.1, 0.02]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[0.62, 1.06]} />
            <meshBasicMaterial map={trainingPosterTexture} />
          </mesh>
        </group>
      )}

      {/* ============================================================ */}
      {/* 9. DECORATIVE POTTED OFFICE PLANTS                           */}
      {/* ============================================================ */}
      <OfficePlant position={[12.4, 0, 34.45]} />
      <OfficePlant position={[16.4, 0, 37.5]} />
    </group>
  );
}

export default CareerCenter;
