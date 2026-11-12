globalThis.self = globalThis;
class NodeFileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (this.onloadend) this.onloadend();
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = "data:application/octet-stream;base64," + Buffer.from(buf).toString("base64");
      if (this.onloadend) this.onloadend();
    });
  }
}
globalThis.FileReader = NodeFileReader;

import fs from "node:fs";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

async function optimizeSkyscraper() {
  console.log("Loading public/models/skyscraper.glb...");
  const buf = fs.readFileSync("public/models/skyscraper.glb");
  const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

  const loader = new GLTFLoader();
  const gltf = await new Promise((resolve, reject) => {
    loader.parse(arrayBuffer, "", resolve, reject);
  });

  const scene = gltf.scene;
  scene.updateMatrixWorld(true);

  // Group geometries by material
  const materialGroups = new Map();

  let originalMeshCount = 0;
  scene.traverse((child) => {
    if (child.isMesh && child.geometry) {
      originalMeshCount++;
      const mat = child.material;
      const key = mat ? mat.name || "default" : "default";
      if (!materialGroups.has(key)) {
        materialGroups.set(key, { material: mat, geometries: [] });
      }

      // Clone geometry and apply world transform relative to root scene
      const geom = child.geometry.clone();
      geom.applyMatrix4(child.matrixWorld);
      materialGroups.get(key).geometries.push(geom);
    }
  });

  console.log(`Original mesh count: ${originalMeshCount}`);
  console.log(`Unique materials: ${materialGroups.size}`);

  const mergedScene = new THREE.Scene();
  mergedScene.name = "Skyscraper_Optimized";

  let totalMergedTris = 0;
  for (const [key, { material, geometries }] of materialGroups) {
    if (geometries.length === 0) continue;
    const mergedGeom = BufferGeometryUtils.mergeGeometries(geometries, false);
    if (!mergedGeom) {
      console.warn(`Failed to merge geometries for material ${key}`);
      continue;
    }
    mergedGeom.computeVertexNormals();
    const mesh = new THREE.Mesh(mergedGeom, material);
    mesh.name = `Skyscraper_${key}`;
    mergedScene.add(mesh);

    const tris = mergedGeom.index ? mergedGeom.index.count / 3 : mergedGeom.attributes.position.count / 3;
    totalMergedTris += tris;
    console.log(`  Merged [${key}]: ${geometries.length} pieces -> 1 mesh (${Math.round(tris)} tris)`);
  }

  console.log(`Total merged meshes: ${mergedScene.children.length}`);
  console.log(`Total triangles: ${Math.round(totalMergedTris)}`);

  // Export to GLB
  const exporter = new GLTFExporter();
  const glbBuffer = await new Promise((resolve, reject) => {
    exporter.parse(
      mergedScene,
      (result) => resolve(Buffer.from(result)),
      reject,
      { binary: true }
    );
  });

  if (!fs.existsSync("public/models/skyscraper.glb.bak")) {
    fs.writeFileSync("public/models/skyscraper.glb.bak", buf);
  }
  fs.writeFileSync("public/models/skyscraper.glb", glbBuffer);
  const origSize = buf.byteLength / 1e6;
  const newSize = glbBuffer.byteLength / 1e6;
  console.log(`Original size: ${origSize.toFixed(2)} MB`);
  console.log(`Optimized size: ${newSize.toFixed(2)} MB`);
  console.log("Successfully replaced public/models/skyscraper.glb (backup saved at .bak)");
}

optimizeSkyscraper().catch(console.error);
