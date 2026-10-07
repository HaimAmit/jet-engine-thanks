window.Music = (() => {
  let ctx, master, timer, playing = false, step = 0, nextTime = 0;
  const BPM = 132;
  const STEP = 60 / BPM / 2;

  // A-minor-ish arpeggio over a I-VI-III-VII progression; MIDI note numbers, 0 = rest.
  const lead = [
    69, 72, 76, 72, 69, 72, 76, 79,
    65, 69, 72, 69, 65, 69, 72, 77,
    60, 64, 67, 64, 60, 64, 67, 72,
    67, 71, 74, 71, 67, 71, 74, 79
  ];
  const bass = [45, 0, 45, 0, 41, 0, 41, 0, 36, 0, 36, 0, 43, 0, 43, 0];

  const freq = n => 440 * Math.pow(2, (n - 69) / 12);

  function ensure() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0.08;
    master.connect(ctx.destination);
  }

  function blip(note, time, dur, type, vol = 1) {
    if (!note) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq(note);
    g.gain.setValueAtTime(vol, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + dur);
    o.connect(g).connect(master);
    o.start(time);
    o.stop(time + dur);
  }

  function schedule() {
    while (nextTime < ctx.currentTime + 0.2) {
      blip(lead[step % lead.length], nextTime, STEP * 0.9, "square", 0.6);
      if (step % 2 === 0) blip(bass[(step / 2) % bass.length], nextTime, STEP * 1.8, "triangle", 1.2);
      nextTime += STEP;
      step++;
    }
  }

  function start() {
    ensure();
    ctx.resume();
    if (playing) return;
    playing = true;
    nextTime = ctx.currentTime + 0.05;
    timer = setInterval(schedule, 50);
  }

  function stop() {
    playing = false;
    clearInterval(timer);
  }

  function sfx(kind) {
    if (!playing) return;
    const t = ctx.currentTime;
    if (kind === "collect") [76, 79, 84, 88].forEach((n, i) => blip(n, t + i * 0.06, 0.12, "square", 0.8));
    if (kind === "hit") blip(40, t, 0.25, "sawtooth", 1);
    if (kind === "win") [72, 76, 79, 84, 79, 84, 88].forEach((n, i) => blip(n, t + i * 0.12, 0.2, "square", 0.8));
  }

  return { start, stop, sfx, get playing() { return playing; } };
})();
