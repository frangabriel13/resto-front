// Copia el lector de QR (.wasm) de zxing-wasm a public/ para servirlo desde el propio sitio en vez
// del CDN por defecto. Corre en `postinstall`, así siempre coincide con la versión instalada.
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const fromBarcodeDetector = createRequire(createRequire(import.meta.url).resolve("barcode-detector"));
const reader = fromBarcodeDetector.resolve("zxing-wasm/reader/zxing_reader.wasm");
const target = join(import.meta.dirname, "..", "public", "vendor", "zxing_reader.wasm");

mkdirSync(dirname(target), { recursive: true });
copyFileSync(reader, target);
console.log(`zxing_reader.wasm → ${target}`);
