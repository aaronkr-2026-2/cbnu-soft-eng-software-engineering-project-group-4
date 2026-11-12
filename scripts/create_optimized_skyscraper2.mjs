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

function buildOptimizedSkyscraper2() {
  const scene = new THREE.Scene();
  scene.name = "OptimizedSkyscraper2";

  // Palette materials
  const matConcrete = new THREE.MeshStandardMaterial({ color: "#e2e8f0", roughness: 0.8 }); // Crisp white/grey stone
  const matGlass = new THREE.MeshStandardMaterial({ color: "#38bdf8", roughness: 0.15, metalness: 0.55 }); // Blue glass
  const matDarkTrim = new THREE.MeshStandardMaterial({ color: "#1e293b", roughness: 0.6, metalness: 0.4 }); // Dark metal
  const matRoof = new THREE.MeshStandardMaterial({ color: "#64748b", roughness: 0.9 }); // Roof grey

  const concreteGeoms = [];
  const glassGeoms = [];
  const trimGeoms = [];
  const roofGeoms = [];

  const addGeom = (list, geom, pos, rot = [0, 0, 0], scale = [1, 1, 1]) => {
    const g = geom.clone();
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(...rot));
    m.compose(new THREE.Vector3(...pos), q, new THREE.Vector3(...scale));
    g.applyMatrix4(m);
    list.push(g);
  };

  // Base Tower: 10m x 10m, height 24m
  addGeom(concreteGeoms, new THREE.BoxGeometry(10.2, 24, 10.2), [0, 12, 0]);
  
  // Glass facade panels on 4 sides (embedded slightly into walls)
  addGeom(glassGeoms, new THREE.BoxGeometry(9.4, 21.6, 10.35), [0, 13, 0]);
  addGeom(glassGeoms, new THREE.BoxGeometry(10.35, 21.6, 9.4), [0, 13, 0]);

  // Horizontal floor dividers (spandrel ribs) every 3 meters
  for (let y = 3; y <= 24; y += 3) {
    addGeom(trimGeoms, new THREE.BoxGeometry(10.45, 0.4, 10.45), [0, y, 0]);
  }

  // Upper setback tier: 7.6m x 7.6m, height 8m (from Y=24 to 32)
  addGeom(concreteGeoms, new THREE.BoxGeometry(7.8, 8, 7.8), [0, 28, 0]);
  addGeom(glassGeoms, new THREE.BoxGeometry(7.2, 7.2, 7.95), [0, 28, 0]);
  addGeom(glassGeoms, new THREE.BoxGeometry(7.95, 7.2, 7.2), [0, 28, 0]);
  addGeom(trimGeoms, new THREE.BoxGeometry(8.0, 0.4, 8.0), [0, 28, 0]);

  // Top penthouse / crown: 5.6m x 5.6m, height 4m (Y=32 to 36)
  addGeom(roofGeoms, new THREE.BoxGeometry(5.8, 4, 5.8), [0, 34, 0]);
  addGeom(trimGeoms, new THREE.BoxGeometry(6.2, 0.35, 6.2), [0, 36, 0]);

  // Architectural Rooftop Spire & Antennas
  addGeom(trimGeoms, new THREE.CylinderGeometry(0.08, 0.25, 6.0, 8), [0, 39, 0]);
  addGeom(trimGeoms, new THREE.CylinderGeometry(0.05, 0.15, 4.0, 8), [1.6, 38, 1.6]);

  // Merge into materials
  const groups = [
    { name: "Tower_Concrete", geoms: concreteGeoms, mat: matConcrete },
    { name: "Tower_Glass", geoms: glassGeoms, mat: matGlass },
    { name: "Tower_Trim", geoms: trimGeoms, mat: matDarkTrim },
    { name: "Tower_Roof", geoms: roofGeoms, mat: matRoof }
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

  console.log(`Optimized Skyscraper2 generated: ${scene.children.length} meshes, ${totalTris} triangles`);
  return scene;
}

async function exportTower() {
  const scene = buildOptimizedSkyscraper2();

  const exporter = new GLTFExporter();
  const glbBuffer = await new Promise((resolve, reject) => {
    exporter.parse(
      scene,
      (result) => resolve(Buffer.from(result)),
      reject,
      { binary: true }
    );
  });

  const origPath = "public/models/skyscraper2.glb";
  const bakPath = "public/models/skyscraper2.glb.bak";
  if (!fs.existsSync(bakPath) && fs.existsSync(origPath)) {
    fs.copyFileSync(origPath, bakPath);
    console.log(`Backed up original skyscraper2.glb (${(fs.statSync(bakPath).size / 1e6).toFixed(1)} MB) to ${bakPath}`);
  }

  fs.writeFileSync(origPath, glbBuffer);
  console.log(`Optimized skyscraper2.glb written: ${(glbBuffer.byteLength / 1024).toFixed(1)} KB`);
}

exportTower().catch(console.error);

