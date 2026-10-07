window.Game = (() => {
  const W = 960, H = 540, PX = 4;
  const FONT = "PressStart, monospace";

  const JET = [
    "....pp..........",
    "....ppp.........",
    "..oywwwwwwwwc...",
    "oyywwwwwwwwwwcw.",
    "..oywwwwwwwwww..",
    ".......ppp......",
    "........ppp.....",
  ];
  const BUG = [
    ".g...g.",
    "..g.g..",
    ".rrrrr.",
    "rrkrkrr",
    "rrrrrrr",
    "r.rrr.r",
    ".r...r.",
  ];
  const COLORS = { p: "#ff4fa3", o: "#ff8a3d", y: "#ffd23f", w: "#f4f1de", c: "#3de8ff", g: "#5cff8a", r: "#ff3d5a", k: "#111" };

  let canvas, ctx, toastEl, crew, onDone;
  let jet, keys, targetY, obstacles, pickups, particles, stars, clouds, skyline;
  let queue, collected, t, lastPickup, lastObstacle, shake, flash, fuel, running, finishedAt, toastUntil, raf, last;

  function sprite(map, x, y, scale = PX) {
    for (let r = 0; r < map.length; r++) {
      for (let c = 0; c < map[r].length; c++) {
        const col = COLORS[map[r][c]];
        if (!col) continue;
        ctx.fillStyle = col;
        ctx.fillRect(Math.round(x + c * scale), Math.round(y + r * scale), scale, scale);
      }
    }
  }

  function rand(a, b) { return a + Math.random() * (b - a); }

  function reset() {
    jet = { x: 120, y: H / 2, w: 16 * PX, h: 7 * PX, vy: 0 };
    keys = {};
    targetY = null;
    obstacles = [];
    pickups = [];
    particles = [];
    stars = Array.from({ length: 90 }, () => ({ x: rand(0, W), y: rand(0, H * 0.75), z: rand(0.2, 1) }));
    clouds = Array.from({ length: 6 }, () => ({ x: rand(0, W), y: rand(30, H * 0.6), w: rand(80, 180) }));
    skyline = Array.from({ length: 40 }, (_, i) => ({ x: i * 32, h: rand(30, 110) }));
    const captain = crew.filter(p => p.cabin === "COCKPIT");
    queue = [...shuffle(crew.filter(p => p.cabin !== "COCKPIT")), ...captain];
    collected = 0;
    t = 0;
    lastPickup = -1.2;
    lastObstacle = 0;
    shake = 0;
    flash = 0;
    fuel = 100;
    finishedAt = null;
    toastUntil = 0;
  }

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function spawnPickup() {
    const person = queue.shift();
    if (!person) return;
    pickups.push({ person, x: W + 40, y: rand(70, H - 140), r: 30, avatar: Avatars.render(person), phase: rand(0, 6) });
  }

  function spawnObstacle() {
    const kinds = ["bug", "bug", "bug", "flaky", "legacy"];
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    const o = { kind, x: W + 40, y: rand(40, H - 150), vx: rand(4.5, 6.5) + t * 0.02, phase: rand(0, 6) };
    if (kind === "bug") { o.w = 7 * PX; o.h = 7 * PX; }
    if (kind === "flaky") { o.w = 132; o.h = 34; o.label = "FLAKY TEST"; }
    if (kind === "legacy") { o.w = 120; o.h = 40; o.label = "LEGACY"; o.vx *= 0.7; }
    const near = pickups.some(p => p.x > W - 80 && Math.abs(p.y - o.y) < 90);
    if (!near) obstacles.push(o);
  }

  function burst(x, y, color, n = 14) {
    for (let i = 0; i < n; i++) {
      particles.push({ x, y, vx: rand(-4, 4), vy: rand(-4, 4), life: rand(20, 40), color });
    }
  }

  function hits(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function showToast(person) {
    toastEl.innerHTML = "";
    const av = Avatars.render(person);
    const text = document.createElement("div");
    text.innerHTML = `<b></b><span></span>`;
    text.querySelector("b").textContent = person.name;
    text.querySelector("span").textContent = person.gameLine;
    toastEl.append(av, text);
    toastEl.hidden = false;
    toastEl.style.animation = "none";
    void toastEl.offsetWidth;
    toastEl.style.animation = "";
    toastUntil = t + 2.4;
  }

  function update(dt) {
    t += dt / 60;
    const speed = 1 + Math.min(t / 60, 0.6);

    if (keys.up) jet.vy -= 0.9 * dt;
    if (keys.down) jet.vy += 0.9 * dt;
    if (targetY !== null) jet.vy += (targetY - (jet.y + jet.h / 2)) * 0.02 * dt;
    jet.vy *= Math.pow(0.86, dt);
    jet.y = Math.max(16, Math.min(H - 110 - jet.h, jet.y + jet.vy * dt));

    stars.forEach(s => { s.x -= s.z * 1.5 * speed * dt; if (s.x < 0) { s.x = W; s.y = rand(0, H * 0.75); } });
    clouds.forEach(c => { c.x -= 0.8 * speed * dt; if (c.x + c.w < 0) { c.x = W + rand(0, 200); c.y = rand(30, H * 0.6); } });
    skyline.forEach(b => { b.x -= 2.2 * speed * dt; if (b.x < -32) { b.x += 40 * 32; b.h = rand(30, 110); } });

    if (!finishedAt) {
      if (t - lastPickup > 2.6 && queue.length) { spawnPickup(); lastPickup = t; }
      if (t - lastObstacle > Math.max(0.55, 1.1 - t * 0.01)) { spawnObstacle(); lastObstacle = t; }
    }

    const jetBox = { x: jet.x + 8, y: jet.y + 6, w: jet.w - 16, h: jet.h - 10 };

    for (const p of pickups) {
      p.x -= 3.4 * speed * dt;
      p.phase += 0.08 * dt;
      const box = { x: p.x - p.r, y: p.y - p.r + Math.sin(p.phase) * 10, w: p.r * 2, h: p.r * 2 };
      if (!p.done && hits(jetBox, box)) {
        p.done = true;
        collected++;
        burst(p.x, p.y, "#ffd23f", 24);
        Music.sfx("collect");
        showToast(p.person);
      }
    }
    // Missed crew members circle back, so nobody can be left behind.
    pickups.filter(p => !p.done && p.x < -60).forEach(p => queue.push(p.person));
    pickups = pickups.filter(p => !p.done && p.x >= -60);

    for (const o of obstacles) {
      o.x -= o.vx * speed * dt;
      o.phase += 0.1 * dt;
      if (o.kind === "bug") o.y += Math.sin(o.phase) * 1.5 * dt;
      if (!o.dead && hits(jetBox, o)) {
        o.dead = true;
        shake = 12;
        flash = 6;
        fuel = Math.max(15, fuel - 7);
        burst(o.x + o.w / 2, o.y + o.h / 2, "#ff3d5a");
        Music.sfx("hit");
      }
    }
    obstacles = obstacles.filter(o => !o.dead && o.x > -200);

    particles.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 0.1 * dt; p.life -= dt; });
    particles = particles.filter(p => p.life > 0);

    if (t > toastUntil) toastEl.hidden = true;
    shake = Math.max(0, shake - dt);
    flash = Math.max(0, flash - dt);

    if (!finishedAt && collected === crew.length) {
      finishedAt = t;
      Music.sfx("win");
    }
    if (finishedAt) jet.x += (t - finishedAt) * 4 * dt;
    if (finishedAt && t - finishedAt > 3.2) finish();
  }

  function drawBackground() {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#0b0b2b");
    g.addColorStop(0.6, "#3a1c6b");
    g.addColorStop(1, "#ff4fa3");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#ffd23f";
    for (let i = 0; i < 9; i++) {
      const y = H - 210 + i * 12;
      ctx.fillRect(W - 280, y, 160, 6 - i * 0.5);
    }

    stars.forEach(s => { ctx.fillStyle = s.z > 0.7 ? "#fff" : "#9a97c4"; ctx.fillRect(s.x | 0, s.y | 0, PX * s.z + 1, PX * s.z + 1); });

    ctx.fillStyle = "rgba(244,241,222,.12)";
    clouds.forEach(c => {
      ctx.fillRect(c.x | 0, c.y | 0, c.w, 16);
      ctx.fillRect((c.x + 16) | 0, (c.y - 12) | 0, c.w - 40, 12);
    });

    ctx.fillStyle = "#140a33";
    skyline.forEach(b => ctx.fillRect(b.x | 0, H - 60 - b.h, 30, b.h));
    ctx.fillStyle = "#ffd23f";
    skyline.forEach((b, i) => {
      for (let wy = H - 50 - b.h; wy < H - 70; wy += 16) {
        if ((i + wy) % 3 === 0) ctx.fillRect((b.x + 8) | 0, wy, 4, 4);
      }
    });

    ctx.fillStyle = "#1c1a33";
    ctx.fillRect(0, H - 60, W, 60);
    ctx.fillStyle = "#ffd23f";
    const off = (t * 300) % 80;
    for (let x = -off; x < W; x += 80) ctx.fillRect(x | 0, H - 32, 40, 6);
  }

  function drawObstacle(o) {
    if (o.kind === "bug") return sprite(BUG, o.x, o.y);
    ctx.fillStyle = o.kind === "legacy" ? "#5a5a7a" : "#ff8a3d";
    ctx.fillRect(o.x | 0, o.y | 0, o.w, o.h);
    ctx.fillStyle = "#111";
    ctx.fillRect((o.x + 4) | 0, (o.y + 4) | 0, o.w - 8, o.h - 8);
    ctx.fillStyle = o.kind === "legacy" ? "#c9c9e0" : "#ffd23f";
    ctx.font = `10px ${FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(o.label, o.x + o.w / 2, o.y + o.h / 2 + 1);
  }

  function drawPickup(p) {
    const y = p.y + Math.sin(p.phase) * 10;
    const s = p.r * 2;
    ctx.fillStyle = "#ffd23f";
    ctx.fillRect((p.x - p.r - 4) | 0, (y - p.r - 4) | 0, s + 8, s + 8);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(p.avatar, (p.x - p.r) | 0, (y - p.r) | 0, s, s);
    ctx.fillStyle = "#fff";
    ctx.font = `8px ${FONT}`;
    ctx.textAlign = "center";
    ctx.fillText(p.person.name.replace(/^The /, "").split(" ")[0].toUpperCase(), p.x, y + p.r + 16);
  }

  function drawHud() {
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = `14px ${FONT}`;
    ctx.fillStyle = "#ffd23f";
    ctx.fillText(`CREW ${collected}/${crew.length}`, 20, 18);
    ctx.fillStyle = "#f4f1de";
    ctx.font = `10px ${FONT}`;
    ctx.fillText("FUEL", 20, 46);
    ctx.fillStyle = "#333";
    ctx.fillRect(70, 44, 120, 12);
    ctx.fillStyle = fuel > 40 ? "#5cff8a" : "#ff8a3d";
    ctx.fillRect(70, 44, 1.2 * fuel, 12);

    if (t < 3.5) {
      ctx.textAlign = "center";
      ctx.font = `16px ${FONT}`;
      ctx.fillStyle = "#fff";
      ctx.fillText("COLLECT THE WHOLE CREW!", W / 2, H / 2 - 40);
      ctx.font = `10px ${FONT}`;
      ctx.fillStyle = "#9a97c4";
      ctx.fillText("AVOID BUGS, FLAKY TESTS & LEGACY CODE", W / 2, H / 2 - 10);
    }
    if (finishedAt) {
      ctx.textAlign = "center";
      ctx.font = `22px ${FONT}`;
      ctx.fillStyle = "#ffd23f";
      ctx.fillText("ALL CREW ON BOARD!", W / 2, H / 2 - 40);
      ctx.font = `12px ${FONT}`;
      ctx.fillStyle = "#fff";
      ctx.fillText("PREPARING FOR LANDING...", W / 2, H / 2);
    }
  }

  function draw() {
    ctx.save();
    if (shake) ctx.translate(rand(-shake, shake) / 2, rand(-shake, shake) / 2);
    drawBackground();
    obstacles.forEach(drawObstacle);
    pickups.forEach(drawPickup);
    if (Math.floor(t * 20) % 2 === 0) {
      ctx.fillStyle = "#ff8a3d";
      ctx.fillRect(jet.x - 14, jet.y + 3 * PX, 12, PX);
    }
    sprite(JET, jet.x, jet.y);
    particles.forEach(p => { ctx.fillStyle = p.color; ctx.fillRect(p.x | 0, p.y | 0, PX, PX); });
    if (flash) { ctx.fillStyle = `rgba(255,61,90,${flash / 20})`; ctx.fillRect(0, 0, W, H); }
    drawHud();
    ctx.restore();
  }

  function loop(now) {
    if (!running) return;
    const dt = Math.min(3, (now - last) / (1000 / 60));
    last = now;
    update(dt);
    draw();
    raf = requestAnimationFrame(loop);
  }

  function onKey(e, down) {
    if (["ArrowUp", "w", "W"].includes(e.key)) { keys.up = down; targetY = null; e.preventDefault(); }
    if (["ArrowDown", "s", "S"].includes(e.key)) { keys.down = down; targetY = null; e.preventDefault(); }
  }
  const keydown = e => onKey(e, true);
  const keyup = e => onKey(e, false);

  function pointer(e) {
    const r = canvas.getBoundingClientRect();
    targetY = (e.clientY - r.top) * (H / r.height);
  }

  function finish() {
    stop();
    onDone && onDone();
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
    if (toastEl) toastEl.hidden = true;
    window.removeEventListener("keydown", keydown);
    window.removeEventListener("keyup", keyup);
  }

  async function start(opts) {
    canvas = opts.canvas;
    toastEl = opts.toast;
    crew = opts.crew;
    onDone = opts.onDone;
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    await document.fonts.load(`10px PressStart`).catch(() => {});
    reset();
    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);
    canvas.onpointerdown = e => { canvas.setPointerCapture(e.pointerId); pointer(e); };
    canvas.onpointermove = e => { if (e.buttons || e.pointerType === "mouse") pointer(e); };
    canvas.onpointerup = e => { if (e.pointerType !== "mouse") targetY = null; };
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(loop);
  }

  function jetCanvas(scale) {
    const c = document.createElement("canvas");
    c.width = 16 * scale;
    c.height = JET.length * scale;
    const prev = ctx;
    ctx = c.getContext("2d");
    sprite(JET, 0, 0, scale);
    ctx = prev;
    return c;
  }

  return { start, stop, jetCanvas };
})();
