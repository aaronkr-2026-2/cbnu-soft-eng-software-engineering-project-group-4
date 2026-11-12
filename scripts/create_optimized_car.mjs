globalThis.self = globalThis;
class NodeFileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (this.onloadend) this.onloadend();
    });
  }
}
globalThis.FileReader = NodeFileReader;

import fs from "node:fs";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

function buildOptimizedCar() {
  const scene = new THREE.Scene();
  scene.name = "OptimizedCityCar";

  // Palette materials
  const matBody = new THREE.MeshStandardMaterial({ color: "#2563eb", roughness: 0.35, metalness: 0.25 }); // Sleek sapphire blue
  const matCabin = new THREE.MeshStandardMaterial({ color: "#1e293b", roughness: 0.2, metalness: 0.6 }); // Tinted glass
  const matTrim = new THREE.MeshStandardMaterial({ color: "#0f172a", roughness: 0.8 }); // Dark chassis trim
  const matWheel = new THREE.MeshStandardMaterial({ color: "#18181b", roughness: 0.9 }); // Rubber tire
  const matRim = new THREE.MeshStandardMaterial({ color: "#e2e8f0", roughness: 0.3, metalness: 0.8 }); // Silver alloy rim
  const matHeadlight = new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: "#fef08a", emissiveIntensity: 1.5 });
  const matTaillight = new THREE.MeshStandardMaterial({ color: "#ef4444", emissive: "#b91c1c", emissiveIntensity: 1.2 });

  const bodyGeoms = [];
  const cabinGeoms = [];
  const trimGeoms = [];
  const wheelGeoms = [];
  const rimGeoms = [];
  const lightGeoms = [];
  const tailGeoms = [];

  const addGeom = (list, geom, pos, rot = [0, 0, 0], scale = [1, 1, 1]) => {
    const g = geom.clone();
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(...rot));
    m.compose(new THREE.Vector3(...pos), q, new THREE.Vector3(...scale));
    g.applyMatrix4(m);
    list.push(g);
  };

  // Main chassis (lower body): 4.0m long (Z), 1.8m wide (X), 0.65m high (Y)
  // Front is -Z, rear is +Z
  addGeom(bodyGeoms, new THREE.BoxGeometry(1.8, 0.55, 3.8), [0, 0.45, 0]);
  
  // Front hood slope
  addGeom(bodyGeoms, new THREE.BoxGeometry(1.76, 0.28, 1.2), [0, 0.62, -1.25]);

  // Rear trunk
  addGeom(bodyGeoms, new THREE.BoxGeometry(1.76, 0.32, 0.95), [0, 0.64, 1.35]);

  // Cabin roof & greenhouse
  addGeom(cabinGeoms, new THREE.BoxGeometry(1.52, 0.58, 1.85), [0, 0.98, -0.05]);
  // Windshield bevel / rake
  addGeom(cabinGeoms, new THREE.CylinderGeometry(0.76, 0.85, 1.5, 6), [0, 0.92, -0.85], [Math.PI / 2, 0, Math.PI / 2], [1, 0.45, 1]);

  // Front & rear bumpers
  addGeom(trimGeoms, new THREE.BoxGeometry(1.84, 0.24, 0.22), [0, 0.32, -1.95]);
  addGeom(trimGeoms, new THREE.BoxGeometry(1.84, 0.24, 0.22), [0, 0.32, 1.95]);

  // Side rocker panels
  addGeom(trimGeoms, new THREE.BoxGeometry(0.12, 0.18, 2.6), [-0.88, 0.24, 0]);
  addGeom(trimGeoms, new THREE.BoxGeometry(0.12, 0.18, 2.6), [0.88, 0.24, 0]);

  // Headlights
  addGeom(lightGeoms, new THREE.BoxGeometry(0.38, 0.14, 0.08), [-0.64, 0.62, -1.92]);
  addGeom(lightGeoms, new THREE.BoxGeometry(0.38, 0.14, 0.08), [0.64, 0.62, -1.92]);

  // Taillights
  addGeom(tailGeoms, new THREE.BoxGeometry(0.42, 0.14, 0.08), [-0.62, 0.64, 1.92]);
  addGeom(tailGeoms, new THREE.BoxGeometry(0.42, 0.14, 0.08), [0.62, 0.64, 1.92]);

  // 4 Wheels
  const wheelPositions = [
    [-0.92, 0.35, -1.2], // Front Left
    [0.92, 0.35, -1.2],  // Front Right
    [-0.92, 0.35, 1.2],  // Rear Left
    [0.92, 0.35, 1.2]   // Rear Right
  ];

  for (const [wx, wy, wz] of wheelPositions) {
    // Tire
    addGeom(wheelGeoms, new THREE.CylinderGeometry(0.35, 0.35, 0.24, 16), [wx, wy, wz], [0, 0, Math.PI / 2]);
    // Rim
    const rimX = wx > 0 ? wx + 0.04 : wx - 0.04;
    addGeom(rimGeoms, new THREE.CylinderGeometry(0.24, 0.24, 0.2, 12), [rimX, wy, wz], [0, 0, Math.PI / 2]);
  }

  // Merge each material group into 1 mesh
  const groups = [
    { name: "Car_Body", geoms: bodyGeoms, mat: matBody },
    { name: "Car_Cabin", geoms: cabinGeoms, mat: matCabin },
    { name: "Car_Trim", geoms: trimGeoms, mat: matTrim },
    { name: "Car_Wheels", geoms: wheelGeoms, mat: matWheel },
    { name: "Car_Rims", geoms: rimGeoms, mat: matRim },
    { name: "Car_Headlights", geoms: lightGeoms, mat: matHeadlight },
    { name: "Car_Taillights", geoms: tailGeoms, mat: matTaillight }
  ];

  let totalTris = 0;
  for (const { name, geoms, mat } of groups) {
    if (geoms.length === 0) continue;
    const merged = BufferGeometryUtils.mergeGeometries(geoms, false);
    merged.computeVertexNormals();
    const mesh = new THREE.Mesh(merged, mat);
    mesh.name = name;
    scene.add(mesh);
    const tris = merged.index ? merged.index.count / 3 : merged.attributes.position.count / 3;
    totalTris += tris;
  }

  console.log(`Optimized car generated: ${scene.children.length} meshes, ${totalTris} triangles`);
  return scene;
}

async function exportCar() {
  const scene = buildOptimizedCar();

  const exporter = new GLTFExporter();
  const glbBuffer = await new Promise((resolve, reject) => {
    exporter.parse(
      scene,
      (result) => resolve(Buffer.from(result)),
      reject,
      { binary: true }
    );
  });

  const origPath = "public/models/car.glb";
  const bakPath = "public/models/car.glb.bak";
  if (!fs.existsSync(bakPath) && fs.existsSync(origPath)) {
    fs.copyFileSync(origPath, bakPath);
    console.log(`Backed up original car.glb (${(fs.statSync(bakPath).size / 1e6).toFixed(1)} MB) to ${bakPath}`);
  }

  fs.writeFileSync(origPath, glbBuffer);
  console.log(`Optimized car.glb written: ${(glbBuffer.byteLength / 1024).toFixed(1)} KB`);
}

exportCar().catch(console.error);

