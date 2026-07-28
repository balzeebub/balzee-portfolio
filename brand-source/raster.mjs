import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const DIR = "/home/claude/balzee/public/branding";
const PNG = path.join(DIR, "png");
fs.mkdirSync(PNG, { recursive: true });

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});

/** Rasterise an SVG at an exact pixel width (or height), preserving ratio. */
async function raster(svgFile, outFile, { width, height, scale = 1 }) {
  const svg = fs.readFileSync(path.join(DIR, svgFile), "utf8");
  const vb = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  const [vw, vh] = [parseFloat(vb[1]), parseFloat(vb[2])];
  const w = width ?? Math.round((height * vw) / vh);
  const h = height ?? Math.round((width * vh) / vw);

  const page = await browser.newPage({
    viewport: { width: w, height: h },
    deviceScaleFactor: scale,
  });
  await page.setContent(
    `<!doctype html><style>
       html,body{margin:0;padding:0;background:transparent}
       svg{display:block;width:${w}px;height:${h}px}
     </style>${svg}`,
  );
  await page.waitForTimeout(60);
  await page.screenshot({ path: outFile, omitBackground: true });
  await page.close();
  return [w * scale, h * scale];
}

const jobs = [
  // transparent artwork — 2x sizes for retina placement in decks and docs
  ["balzee-mark-dark.svg", "balzee-mark-dark.png", { height: 512 }],
  ["balzee-mark-dark.svg", "balzee-mark-dark@2x.png", { height: 1024 }],
  ["balzee-mark-light.svg", "balzee-mark-light.png", { height: 512 }],
  ["balzee-mark-light.svg", "balzee-mark-light@2x.png", { height: 1024 }],
  ["balzee-mark-accent.svg", "balzee-mark-accent.png", { height: 512 }],

  ["balzee-wordmark-dark.svg", "balzee-wordmark-dark.png", { width: 1200 }],
  ["balzee-wordmark-light.svg", "balzee-wordmark-light.png", { width: 1200 }],

  ["balzee-logo-horizontal-dark.svg", "balzee-logo-horizontal-dark.png", { width: 1600 }],
  ["balzee-logo-horizontal-light.svg", "balzee-logo-horizontal-light.png", { width: 1600 }],
  ["balzee-logo-horizontal-compact-dark.svg", "balzee-logo-horizontal-compact-dark.png", { width: 1200 }],
  ["balzee-logo-horizontal-compact-light.svg", "balzee-logo-horizontal-compact-light.png", { width: 1200 }],

  ["balzee-logo-vertical-dark.svg", "balzee-logo-vertical-dark.png", { height: 900 }],
  ["balzee-logo-vertical-light.svg", "balzee-logo-vertical-light.png", { height: 900 }],
  ["balzee-logo-vertical-compact-dark.svg", "balzee-logo-vertical-compact-dark.png", { height: 800 }],
  ["balzee-logo-vertical-compact-light.svg", "balzee-logo-vertical-compact-light.png", { height: 800 }],
];

for (const [src, out, opts] of jobs) {
  const [w, h] = await raster(src, path.join(PNG, out), opts);
  console.log(`${out.padEnd(46)} ${w}x${h}`);
}

// Favicons and app icons live at the branding root — they are wired into the app.
const icons = [
  ["favicon.svg", "favicon-32.png", 32],
  ["favicon.svg", "favicon-64.png", 64],
  ["balzee-icon.svg", "apple-touch-icon.png", 180],
  ["balzee-icon.svg", "icon-192.png", 192],
  ["balzee-icon.svg", "icon-512.png", 512],
];
for (const [src, out, size] of icons) {
  await raster(src, path.join(DIR, out), { width: size, height: size });
  console.log(`${out.padEnd(46)} ${size}x${size}`);
}

await browser.close();
