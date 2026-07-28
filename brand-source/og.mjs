import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const DIR = "/home/claude/balzee/public/branding";
const lockup = fs.readFileSync(path.join(DIR, "balzee-logo-vertical-dark.svg"), "utf8");

const html = `<!doctype html><meta charset="utf-8">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1200px;height:630px;background:#0F0F0F;color:#fff;overflow:hidden;position:relative;
       font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;
       display:flex;align-items:center;justify-content:center}
  .grid{position:absolute;inset:0;
        background-image:linear-gradient(to right,rgba(255,255,255,.055) 1px,transparent 1px),
                         linear-gradient(to bottom,rgba(255,255,255,.055) 1px,transparent 1px);
        background-size:76px 76px;
        -webkit-mask-image:radial-gradient(78% 66% at 50% 18%,#000 0%,transparent 100%)}
  .bloom{position:absolute;width:720px;height:720px;left:50%;top:-46%;transform:translateX(-50%);
         border-radius:50%;filter:blur(50px);
         background:radial-gradient(circle,rgba(34,197,94,.15) 0%,rgba(34,197,94,.035) 36%,rgba(34,197,94,0) 68%)}
  .vignette{position:absolute;inset:0;
            background:linear-gradient(to top,#0F0F0F 0%,rgba(15,15,15,.55) 34%,transparent 68%)}
  .stack{position:relative;display:flex;flex-direction:column;align-items:center;gap:40px}
  .stack svg{width:390px;height:auto;display:block}
  .rule{width:60px;height:1px;background:rgba(255,255,255,.18)}
  .role{font-size:19px;letter-spacing:.30em;text-transform:uppercase;color:#A8A8A8;
        text-indent:.30em}
  .edge{position:absolute;left:0;right:0;bottom:0;height:3px;
        background:linear-gradient(to right,transparent,#22C55E 50%,transparent);opacity:.85}
</style>
<div class="grid"></div><div class="bloom"></div><div class="vignette"></div>
<div class="stack">
  ${lockup}
  <div class="rule"></div>
  <div class="role">Marketing Virtual Assistant</div>
</div>
<div class="edge"></div>`;

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.waitForTimeout(200);
await page.screenshot({ path: path.join(DIR, "og-image.png") });
await page.close();
await browser.close();
console.log("og-image.png 1200x630");
