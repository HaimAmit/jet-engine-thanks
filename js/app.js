(() => {
  const C = window.CONTENT;
  const $ = s => document.querySelector(s);
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const byId = Object.fromEntries(C.crew.map(p => [p.id, p]));

  function crewRefs(ids) {
    const out = [];
    for (const id of ids) {
      if (byId[id]) {
        const c = Avatars.render(byId[id]);
        c.title = byId[id].name;
        out.push(c);
      } else {
        const members = C.crew.filter(p => p.group.toLowerCase() === id.toLowerCase());
        if (members.length) members.forEach(m => { const c = Avatars.render(m); c.title = m.name; out.push(c); });
        else out.push(el("span", "tag", id.toUpperCase()));
      }
    }
    return out;
  }

  function renderTimeline() {
    $("#flight-no").textContent = C.flight;
    const list = $("#timeline");
    C.timeline.forEach(item => {
      const li = el("li", "tl-item");
      const dot = el("div", "tl-dot", item.icon);
      const card = el("div", "tl-card");
      card.append(
        el("div", "tl-date", item.date),
        el("div", "tl-phase", item.phase),
        el("h3", "tl-title", item.title),
        el("p", "tl-text", item.text)
      );
      const crew = el("div", "tl-crew");
      crew.append(...crewRefs(item.crew));
      card.append(crew);
      if (item.image) {
        const fig = el("figure", "tl-image");
        const img = el("img");
        img.src = item.image;
        img.alt = item.caption || "";
        img.loading = "lazy";
        fig.append(img, el("figcaption", null, item.caption || ""));
        card.append(fig);
      }
      li.append(dot, card);
      list.append(li);
    });
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("seen"); io.unobserve(e.target); } });
    }, { threshold: 0.2 });
    list.querySelectorAll(".tl-item").forEach(li => io.observe(li));
  }

  function field(label, value) {
    const d = el("div");
    d.append(el("small", null, label), document.createTextNode(value));
    return d;
  }

  function renderPasses() {
    $("#captain-message").textContent = C.captainMessage;
    $("#captain-sign").textContent = `— ${C.captain}`;
    const wrap = $("#passes");
    C.crew.forEach(p => {
      const pass = el("button", "pass");
      pass.type = "button";
      pass.setAttribute("aria-label", `Boarding pass for ${p.name}. Press to flip.`);
      const inner = el("div", "pass-inner");

      const front = el("div", "pass-face pass-front");
      const fm = el("div", "pass-main");
      const head = el("div", "pass-head");
      head.append(el("span", null, "✈ JET ENGINE AIRLINES"), el("span", null, "BOARDING PASS"));
      const who = el("div", "pass-who");
      const meta = el("div");
      meta.append(el("div", "pass-name", p.name.toUpperCase()), el("div", "pass-title", p.title));
      who.append(Avatars.render(p), meta);
      const route = el("div", "pass-route");
      const from = el("div"); from.append(el("small", null, "FROM"), document.createTextNode("LEGACY"));
      const to = el("div"); to.append(el("small", null, "TO"), document.createTextNode("JET"));
      route.append(from, el("span", "arrow", "✈ ▶"), to);
      const fields = el("div", "pass-fields");
      fields.append(field("FLIGHT", C.flight), field("DATE", C.launchDate), field("CLASS", p.cabin));
      fm.append(head, who, route, fields, el("div", "flip-hint", "TAP TO FLIP ↻"));
      const stub = el("div", "pass-stub");
      stub.append(el("div", "seat", `SEAT ${p.seat}`), el("div", "barcode"));
      front.append(fm, stub);

      const back = el("div", "pass-face pass-back");
      const bm = el("div", "pass-main");
      const bhead = el("div", "pass-head");
      bhead.append(el("span", null, p.name.toUpperCase()), el("span", null, "FLIGHT RECORD"));
      const stats = el("div", "stats");
      p.stats.forEach(([k, v]) => { const d = el("div"); d.append(el("span", null, k), el("b", null, v)); stats.append(d); });
      bm.append(bhead, stats, el("div", "superlative", `★ ${p.superlative}`), el("p", "note", p.note));
      const bstub = el("div", "pass-stub");
      bstub.append(el("div", "seat", "THANK YOU"), el("div", "barcode"));
      back.append(bm, bstub);

      inner.append(front, back);
      pass.append(inner);
      pass.addEventListener("click", () => pass.classList.toggle("flipped"));
      wrap.append(pass);
    });
  }

  function renderCredits() {
    const crawl = $("#crawl");
    crawl.append(el("h3", null, "JET ENGINE"), el("p", null, `${C.flight} · DEC 2025 → ${C.launchDate}`));
    const groups = [...new Set(C.crew.map(p => p.group))];
    groups.forEach(g => {
      crawl.append(el("h3", null, g.toUpperCase()));
      C.crew.filter(p => p.group === g).forEach(p => {
        const line = el("p", null, p.name);
        line.append(el("span", "role", p.title));
        crawl.append(line);
      });
    });
    crawl.append(el("h3", null, "FROM THE BLACK BOX"));
    C.funFacts.forEach(f => crawl.append(el("p", null, f)));
    crawl.append(el("h3", null, "SPECIAL THANKS"));
    C.specialThanks.forEach(s => crawl.append(el("p", null, s)));
    crawl.append(el("h3", null, "CAPTAIN'S NOTE"), el("p", null, C.captainMessage), el("p", null, `— ${C.captain}`));

    const fig = $("#gource");
    const video = fig.querySelector("video");
    video.addEventListener("loadedmetadata", () => { fig.hidden = false; });
    video.load();
  }

  function setMusic(on) {
    on ? Music.start() : Music.stop();
    const b = $("#music-toggle");
    b.setAttribute("aria-pressed", String(on));
    b.textContent = on ? "♪ ON" : "♪ OFF";
  }

  function enterMain() {
    Game.stop();
    $("#start").hidden = true;
    $("#game").hidden = true;
    $(".topnav").hidden = false;
    $("#main").hidden = false;
    $("#log").scrollIntoView();
  }

  function startGame() {
    setMusic(true);
    $("#start").hidden = true;
    $("#game").hidden = false;
    $("#game").scrollIntoView();
    Game.start({ canvas: $("#game-canvas"), toast: $("#toast"), crew: C.crew, onDone: enterMain });
  }

  async function init() {
    $("#start-jet").append(Game.jetCanvas(8));
    await Avatars.load(C.crew);
    renderTimeline();
    renderPasses();
    renderCredits();
    $("#press-start").addEventListener("click", startGame);
    $("#skip-game").addEventListener("click", enterMain);
    $("#game-skip").addEventListener("click", enterMain);
    $("#music-toggle").addEventListener("click", () => setMusic(!Music.playing));
    $("#replay").addEventListener("click", () => {
      $("#main").hidden = true;
      $(".topnav").hidden = true;
      $("#start").hidden = false;
      window.scrollTo(0, 0);
    });
  }

  init();
})();
