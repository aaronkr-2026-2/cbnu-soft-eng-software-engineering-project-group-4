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

function buildOptimizedShopShelf() {
  const scene = new THREE.Scene();
  scene.name = "OptimizedShopShelf";

  // Palette materials matching grocery interior
  const matFrame = new THREE.MeshStandardMaterial({ color: "#334155", roughness: 0.6, metalness: 0.3 }); // Dark metal rack
  const matShelf = new THREE.MeshStandardMaterial({ color: "#f8fafc", roughness: 0.4 }); // Clean white metal shelf
  const matGoodsA = new THREE.MeshStandardMaterial({ color: "#ef4444", roughness: 0.5 }); // Red boxes
  const matGoodsB = new THREE.MeshStandardMaterial({ color: "#3b82f6", roughness: 0.5 }); // Blue boxes
  const matGoodsC = new THREE.MeshStandardMaterial({ color: "#eab308", roughness: 0.5 }); // Yellow cans
  const matGoodsD = new THREE.MeshStandardMaterial({ color: "#22c55e", roughness: 0.5 }); // Green boxes

  const frameGeoms = [];
  const shelfGeoms = [];
  const goodsGeomsA = [];
  const goodsGeomsB = [];
  const goodsGeomsC = [];
  const goodsGeomsD = [];

  const addGeom = (list, geom, pos, rot = [0, 0, 0], scale = [1, 1, 1]) => {
    const g = geom.clone();
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(...rot));
    m.compose(new THREE.Vector3(...pos), q, new THREE.Vector3(...scale));
    g.applyMatrix4(m);
    list.push(g);
  };

  // Raw dimensions matching original:
  // X: [-3600, 3500] (width ~ 7100)
  // Y: [0, 8500] (height ~ 8500)
  // Z: [0, 3800] (depth ~ 3800)

  // 3 Aisle Bays: West (-2300), Center (0), East (2300)
  const bayWidth = 2200;
  const bayDepth = 1800;
  const shelfHeights = [600, 2600, 4600, 6600];

  for (const bx of [-2300, 0, 2300]) {
    // 4 Upright vertical frame pillars per bay
    for (const pz of [800, 800 + bayDepth]) {
      addGeom(frameGeoms, new THREE.BoxGeometry(120, 8400, 120), [bx - bayWidth / 2, 4200, pz]);
      addGeom(frameGeoms, new THREE.BoxGeometry(120, 8400, 120), [bx + bayWidth / 2, 4200, pz]);
    }

    // Backing panel
    addGeom(frameGeoms, new THREE.BoxGeometry(bayWidth, 7500, 40), [bx, 4200, 800]);

    // Shelves
    for (let si = 0; si < shelfHeights.length; si++) {
      const sy = shelfHeights[si];
      addGeom(shelfGeoms, new THREE.BoxGeometry(bayWidth - 40, 80, bayDepth - 40), [bx, sy, 800 + bayDepth / 2]);

      // Stocked merchandise rows on shelves
      const goodsList = [goodsGeomsA, goodsGeomsB, goodsGeomsC, goodsGeomsD][si % 4];
      const rowZ = 800 + bayDepth / 2;
      for (let gx = -bayWidth / 2 + 250; gx < bayWidth / 2 - 200; gx += 380) {
        addGeom(goodsList, new THREE.BoxGeometry(320, 520, 480), [bx + gx, sy + 300, rowZ - 300]);
        addGeom(goodsList, new THREE.BoxGeometry(300, 480, 440), [bx + gx, sy + 280, rowZ + 300]);
      }
    }
  }

  const groups = [
    { name: "Shelf_Frame", geoms: frameGeoms, mat: matFrame },
    { name: "Shelf_Plates", geoms: shelfGeoms, mat: matShelf },
    { name: "Goods_Red", geoms: goodsGeomsA, mat: matGoodsA },
    { name: "Goods_Blue", geoms: goodsGeomsB, mat: matGoodsB },
    { name: "Goods_Yellow", geoms: goodsGeomsC, mat: matGoodsC },
    { name: "Goods_Green", geoms: goodsGeomsD, mat: matGoodsD }
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

  console.log(`Optimized Shop Shelf generated: ${scene.children.length} meshes, ${totalTris} triangles`);
  return scene;
}

async function exportShelf() {
  const scene = buildOptimizedShopShelf();

  const exporter = new GLTFExporter();
  const glbBuffer = await new Promise((resolve, reject) => {
    exporter.parse(
      scene,
      (result) => resolve(Buffer.from(result)),
      reject,
      { binary: true }
    );
  });

  const origPath = "public/models/shop_furniture_new.glb";
  const bakPath = "public/models/shop_furniture_new.glb.bak";
  if (!fs.existsSync(bakPath) && fs.existsSync(origPath)) {
    fs.copyFileSync(origPath, bakPath);
    console.log(`Backed up original shop_furniture_new.glb (${(fs.statSync(bakPath).size / 1e6).toFixed(1)} MB) to ${bakPath}`);
  }

  fs.writeFileSync(origPath, glbBuffer);
  console.log(`Optimized shop_furniture_new.glb written: ${(glbBuffer.byteLength / 1024).toFixed(1)} KB`);
}

exportShelf().catch(console.error);
