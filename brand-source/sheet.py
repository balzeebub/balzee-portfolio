import pathlib

D = pathlib.Path("/home/claude/balzee/public/branding")
r = lambda n: (D / n).read_text()

MARK_OUTER = "M0,0 H46 L64,18 V37 L48,53 L72,77 V88 L54,106 H0 Z"
STEM = "M0,0 H24 V106 H0 Z"
ARROW = "M24,18 L50,31 L24,44 Z M24,62 L56,75 L24,88 Z"


def mini(d, fill="#fff", w=72, h=106):
    return (
        f'<svg viewBox="0 0 {w} {h}" fill="{fill}"><path fill-rule="evenodd" d="{d}"/></svg>'
    )


swatches = [
    ("Ink", "#0F0F0F", "Background · light-mode artwork"),
    ("Paper", "#FFFFFF", "Dark-mode artwork"),
    ("Accent", "#22C55E", "CTAs · links · highlights"),
    ("Muted", "#A8A8A8", "Tagline on dark"),
]
sw = "".join(
    f'<div class="sw"><span class="chip" style="background:{hexv};'
    f'{"border:1px solid rgba(255,255,255,.14)" if hexv == "#0F0F0F" else ""}"></span>'
    f'<b>{n}</b><code>{hexv}</code><em>{use}</em></div>'
    for n, hexv, use in swatches
)

scales = "".join(
    f'<span style="width:{s}px;display:inline-block">{r("balzee-mark-dark.svg")}</span>'
    for s in (14, 18, 24, 32, 48, 72)
)

HTML = f"""<!doctype html><meta charset="utf-8">
<style>
  *{{margin:0;padding:0;box-sizing:border-box}}
  body{{width:1240px;background:#0B0B0B;color:#fff;
        font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}}
  svg{{width:100%;height:auto;display:block}}
  .hero{{position:relative;padding:96px 0 92px;background:#0F0F0F;overflow:hidden;
         display:flex;align-items:center;justify-content:center}}
  .hero .grid{{position:absolute;inset:0;
     background-image:linear-gradient(to right,rgba(255,255,255,.05) 1px,transparent 1px),
                      linear-gradient(to bottom,rgba(255,255,255,.05) 1px,transparent 1px);
     background-size:76px 76px;
     -webkit-mask-image:radial-gradient(72% 70% at 50% 26%,#000,transparent)}}
  .hero .bloom{{position:absolute;width:760px;height:760px;left:50%;top:-52%;
     transform:translateX(-50%);border-radius:50%;filter:blur(54px);
     background:radial-gradient(circle,rgba(34,197,94,.16) 0%,rgba(34,197,94,0) 66%)}}
  .hero .lk{{position:relative;width:340px}}
  .band{{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,.09)}}
  .cell{{background:#0F0F0F;padding:52px 44px;display:flex;flex-direction:column;
         align-items:center;justify-content:center;gap:34px;min-height:250px}}
  .cell.light{{background:#fff}}
  .cell .cap{{font-size:9.5px;letter-spacing:.26em;text-transform:uppercase;color:#7c7c7c;text-indent:.26em}}
  .cell.light .cap{{color:#8a8a8a}}
  .lower{{display:grid;grid-template-columns:1.05fr 1fr;gap:1px;background:rgba(255,255,255,.09)}}
  .panel{{background:#0F0F0F;padding:44px}}
  h3{{font-size:9.5px;letter-spacing:.26em;text-transform:uppercase;color:#7c7c7c;
      margin-bottom:30px;font-weight:500;text-indent:.26em}}
  .formula{{display:flex;align-items:center;gap:24px}}
  .formula .step{{text-align:center;flex:0 0 auto}}
  .formula .step svg{{height:64px;width:auto;margin:0 auto 14px}}
  .formula .lbl{{font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:#8f8f8f;line-height:1.6}}
  .op{{font-size:20px;color:#4a4a4a;padding-bottom:26px}}
  .sw{{display:grid;grid-template-columns:34px 62px 78px 1fr;align-items:center;
       gap:14px;padding:11px 0;border-bottom:1px solid rgba(255,255,255,.07);font-size:12px}}
  .sw:last-child{{border-bottom:0}}
  .chip{{width:34px;height:34px;border-radius:9px;display:block}}
  .sw b{{font-weight:500}}
  .sw code{{color:#a8a8a8;font-family:ui-monospace,monospace;font-size:11px}}
  .sw em{{color:#7c7c7c;font-style:normal;font-size:11px}}
  .scale{{display:flex;gap:26px;align-items:flex-end;padding:26px 0 6px}}
  .foot{{padding:26px 44px;background:#0B0B0B;display:flex;justify-content:space-between;
         font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#5c5c5c}}
</style>

<div class="hero"><div class="grid"></div><div class="bloom"></div>
  <div class="lk">{r("balzee-logo-vertical-dark.svg")}</div></div>

<div class="band">
  <div class="cell"><div style="width:300px">{r("balzee-logo-horizontal-dark.svg")}</div>
    <div class="cap">Horizontal lockup</div></div>
  <div class="cell light"><div style="width:190px">{r("balzee-logo-vertical-light.svg")}</div>
    <div class="cap">Light version</div></div>
  <div class="cell"><div style="width:78px">{r("balzee-mark-dark.svg")}</div>
    <div class="cap">Monogram</div></div>
</div>

<div class="band">
  <div class="cell"><div style="width:250px">{r("balzee-logo-horizontal-compact-dark.svg")}</div>
    <div class="cap">Compact lockup</div></div>
  <div class="cell"><div style="width:112px">{r("balzee-icon.svg")}</div>
    <div class="cap">App icon</div></div>
  <div class="cell"><div style="width:78px">{r("balzee-mark-accent.svg")}</div>
    <div class="cap">Accent mark</div></div>
</div>

<div class="lower">
  <div class="panel">
    <h3>Construction</h3>
    <div class="formula">
      <div class="step">{mini(STEM, "#fff", 24, 106)}<div class="lbl">Stem<br>Initial B</div></div>
      <div class="op">+</div>
      <div class="step">{mini(ARROW, "#22C55E")}<div class="lbl">Two arrows<br>Forward motion</div></div>
      <div class="op">+</div>
      <div class="step">{mini(MARK_OUTER)}<div class="lbl">45° chamfers<br>Precision</div></div>
      <div class="op">=</div>
      <div class="step">{r("balzee-mark-dark.svg")}<div class="lbl">Balzee<br>mark</div></div>
    </div>
    <h3 style="margin-top:44px">Scales cleanly</h3>
    <div class="scale">{scales}</div>
  </div>
  <div class="panel"><h3>Palette</h3>{sw}
    <h3 style="margin-top:40px">Wordmark</h3>
    <div style="width:290px">{r("balzee-wordmark-dark.svg")}</div>
    <p style="margin-top:16px;font-size:11px;color:#7c7c7c;line-height:1.7">
      Space Grotesk, weight 500, 0.26 em tracking — converted to outlines,
      so the logo carries no font dependency.</p>
  </div>
</div>

<div class="foot"><span>Balzee — Brand identity</span><span>Original geometric system</span></div>
"""
pathlib.Path("/home/claude/brand/cand/sheet2.html").write_text(HTML)
print("ok")
