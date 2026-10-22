/* Reads window.SITE_CONFIG (config.js) and fills the page. No dependencies. */
(function () {
  var c = window.SITE_CONFIG;
  if (!c) { console.error("config.js missing or invalid"); return; }

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var get = function (path) { return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, c); };

  // ----- <head> / SEO -----
  var m = c.meta || {};
  var setMeta = function (attr, key, val) {
    if (!val) return;
    var el = $('meta[' + attr + '="' + key + '"]');
    if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
    el.setAttribute("content", val);
  };
  document.title = m.title || c.brand;
  setMeta("name", "description", m.description);
  setMeta("name", "theme-color", m.themeColor);
  setMeta("property", "og:type", "website");
  setMeta("property", "og:site_name", c.brand);
  setMeta("property", "og:title", m.title);
  setMeta("property", "og:description", m.description);
  setMeta("property", "og:url", m.url);
  setMeta("property", "og:image", m.image);
  setMeta("name", "twitter:card", m.image ? "summary_large_image" : "summary");
  setMeta("name", "twitter:title", m.title);
  setMeta("name", "twitter:description", m.description);
  setMeta("name", "twitter:image", m.image);
  setMeta("name", "twitter:site", m.twitterHandle);
  if (m.url) {
    var link = $('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = m.url;
  }

  // ----- Text + attribute bindings -----
  $$("[data-text]").forEach(function (el) { el.textContent = get(el.dataset.text) || ""; });
  $$("[data-bind='logo']").forEach(function (el) { el.src = c.logo; });

  // Headline: first N words get the accent gradient
  var words = String(c.headline || "").split(/\s+/);
  var n = c.headlineAccentWords == null ? 1 : c.headlineAccentWords;
  var h = $("[data-headline]");
  h.textContent = "";
  if (n > 0) {
    var span = document.createElement("span");
    span.className = "accent";
    span.textContent = words.slice(0, n).join(" ");
    h.appendChild(span);
    if (words.length > n) h.appendChild(document.createTextNode(" " + words.slice(n).join(" ")));
  } else {
    h.textContent = words.join(" ");
  }

  // CTAs
  var bindBtn = function (el, cfg) {
    if (!cfg || !cfg.label) { el.hidden = true; return; }
    el.textContent = cfg.label;
    el.href = cfg.href;
    if (/^https?:/.test(cfg.href)) { el.target = "_blank"; el.rel = "noopener noreferrer"; }
  };
  bindBtn($("[data-cta]"), c.cta);
  bindBtn($("[data-cta2]"), c.secondaryCta);

  // Socials (header + footer lists)
  $$("[data-socials]").forEach(function (ul) {
    ul.textContent = "";
    (c.socials || []).forEach(function (s) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = s.url; a.target = "_blank"; a.rel = "noopener noreferrer";
      a.setAttribute("aria-label", s.name);
      a.title = s.name;
      var img = document.createElement("img");
      img.src = s.icon; img.alt = ""; img.width = 20; img.height = 20;
      a.appendChild(img); li.appendChild(a); ul.appendChild(li);
    });
  });

  // Hero terminal card
  var hc = c.heroCard || {};
  var money = function (n) { return "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  var tex = { tickerLabel: (hc.ticker || "") + " \u2022 " + (hc.timeframe || ""), status: hc.status, price: hc.price, change: hc.change };
  $$("[data-hc]").forEach(function (el) { el.textContent = tex[el.dataset.hc] || ""; });
  var pill = $(".pill");
  if (pill) pill.dataset.dir = hc.direction === "down" ? "down" : "up";

  var stats = $("[data-stats]");
  if (stats) {
    stats.textContent = "";
    (hc.stats || []).forEach(function (s) {
      var li = document.createElement("li");
      var sm = document.createElement("small"); sm.textContent = s.label;
      var st = document.createElement("strong"); st.textContent = s.value;
      li.appendChild(sm); li.appendChild(st); stats.appendChild(li);
    });
  }

  var chart = $("[data-chart]");
  var cs = hc.candles || [];
  if (chart && cs.length) {
    var NS = "http://www.w3.org/2000/svg";
    var W = 360, H = 230, PL = 8, PR = 8, PT = 14, PH = 150, VOL_H = 40; // price area y: PT..PT+PH; volume bars sit below
    var tv = hc.target && hc.target.value, fv = hc.floor && hc.floor.value;
    var hi = Math.max.apply(null, cs.map(function (k) { return k[1]; }).concat(tv == null ? [] : [tv]));
    var lo = Math.min.apply(null, cs.map(function (k) { return k[2]; }).concat(fv == null ? [] : [fv]));
    var pad = (hi - lo) * 0.06; hi += pad; lo -= pad;
    var y = function (p) { return PT + (hi - p) / (hi - lo) * PH; };
    var step = (W - PL - PR) / (cs.length + 1);       // spare slot on the right for the projection
    var x = function (i) { return PL + step * (i + 0.5); };
    var bw = Math.min(14, step * 0.55);
    var vmax = Math.max.apply(null, cs.map(function (k) { return k[4] || 0; })) || 1;
    var volBase = H - 6;
    var el = function (n, a, parent) {
      var e = document.createElementNS(NS, n);
      Object.keys(a).forEach(function (k) { e.setAttribute(k, a[k]); });
      if (parent) parent.appendChild(e);
      return e;
    };
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": (hc.ticker || "") + " candlestick chart" });
    var defs = el("defs", {}, svg);
    var g = el("linearGradient", { id: "trendGrad", x1: 0, x2: 1 }, defs);
    el("stop", { offset: 0, "stop-color": "#ff3d2e" }, g);
    el("stop", { offset: 1, "stop-color": "#ffb04d" }, g);
    var gl = el("filter", { id: "glow", x: "-20%", y: "-20%", width: "140%", height: "140%" }, defs);
    el("feGaussianBlur", { stdDeviation: 3, result: "b" }, gl);
    var mg = el("feMerge", {}, gl);
    el("feMergeNode", { in: "b" }, mg);
    el("feMergeNode", { in: "SourceGraphic" }, mg);

    for (var gi = 0; gi < 4; gi++) {                  // faint grid
      var gy = PT + PH * gi / 3;
      el("line", { x1: PL, x2: W - PR, y1: gy, y2: gy, stroke: "#fff", "stroke-opacity": 0.05 }, svg);
    }
    [[tv, "#2fd08a"], [fv, "#ff4d2e"]].forEach(function (t) {   // target + risk floor
      if (t[0] == null) return;
      el("line", { x1: PL, x2: W - PR, y1: y(t[0]), y2: y(t[0]), stroke: t[1], "stroke-width": 1, "stroke-dasharray": "5 4", "stroke-opacity": 0.8 }, svg);
    });
    cs.forEach(function (k, i) {                      // volume bars
      var vh = Math.max(2, (k[4] || 0) / vmax * VOL_H), up = k[3] >= k[0];
      el("rect", { x: x(i) - bw / 2, y: volBase - vh, width: bw, height: vh, rx: 1.5, fill: up ? "#2fd08a" : "#ff4d2e", "fill-opacity": 0.35 }, svg);
    });
    cs.forEach(function (k, i) {                      // candles: wick + body
      var col = k[3] >= k[0] ? "#2fd08a" : "#ff4d2e";
      el("line", { x1: x(i), x2: x(i), y1: y(k[1]), y2: y(k[2]), stroke: col, "stroke-width": 1.5, "stroke-linecap": "round" }, svg);
      el("rect", { x: x(i) - bw / 2, y: y(Math.max(k[0], k[3])), width: bw, height: Math.max(1.5, Math.abs(y(k[0]) - y(k[3]))), rx: 2, fill: col }, svg);
    });

    // Breakout trajectory: smooth curve from the first close, arcing up toward the target
    var x0 = x(0), y0 = y(cs[0][3]), x1 = W - PR - 10, y1 = y(tv == null ? hi : tv);
    el("path", {
      class: "trend", pathLength: 1,
      d: "M" + x0 + " " + y0 + " C " + (x0 + (x1 - x0) * 0.55) + " " + (y0 + 6) + ", " + (x0 + (x1 - x0) * 0.8) + " " + (y1 + 30) + ", " + x1 + " " + y1,
      fill: "none", stroke: "url(#trendGrad)", "stroke-width": 2.5, "stroke-linecap": "round", filter: "url(#glow)"
    }, svg);
    el("circle", { cx: x1, cy: y1, r: 3.5, fill: "#ffb04d", filter: "url(#glow)" }, svg);
    chart.appendChild(svg);

    [["target", tv], ["floor", fv]].forEach(function (t) {  // HTML labels keep text crisp at any width
      if (!hc[t[0]] || t[1] == null) return;
      var lab = document.createElement("span");
      lab.className = "chart__label chart__label--" + t[0];
      lab.style.top = (y(t[1]) / H * 100) + "%";
      lab.textContent = hc[t[0]].label + ": " + money(t[1]);
      chart.appendChild(lab);
    });
  }

  // Footer
  var f = $("[data-footer]");
  if (f) f.textContent = String(c.footer || "").replace("{year}", new Date().getFullYear());

  // Entrance animation
  var copy = $(".hero__copy");
  Array.prototype.forEach.call(copy.children, function (el, i) { el.style.setProperty("--i", i); });
  copy.classList.add("reveal");
  $(".hero__visual").classList.add("reveal-visual");
})();
