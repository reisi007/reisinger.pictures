import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configPath = path.resolve(__dirname, "../config/camera-lens-map.json");

/** @type {{ camera: Record<string, string>, lens: Record<string, string> }} */
let _map = null;

function loadMap() {
  if (_map) return _map;
  try {
    const raw = fs.readFileSync(configPath, "utf-8");
    const data = JSON.parse(raw);
    _map = {
      camera: Object.fromEntries(
        Object.entries(data.camera || {}).map(([k, v]) => [k.toLowerCase(), v])
      ),
      lens: Object.fromEntries(
        Object.entries(data.lens || {}).map(([k, v]) => [k.toLowerCase(), v])
      ),
    };
  } catch {
    _map = { camera: {}, lens: {} };
  }
  return _map;
}

function lookup(value, map) {
  if (!value) return value;
  const lower = value.toLowerCase();
  if (map[lower]) return map[lower];
  for (const [key, replacement] of Object.entries(map)) {
    if (lower.includes(key)) return replacement;
  }
  return value;
}

export function applyCameraMap(camera) {
  return lookup(camera, loadMap().camera);
}

export function applyLensMap(lens) {
  return lookup(lens, loadMap().lens);
}
