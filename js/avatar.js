window.Avatars = (() => {
  const GRID = 24;
  const PALETTE = ["#ff4fa3", "#3de8ff", "#ffd23f", "#5cff8a", "#ff8a3d", "#b18cff"];
  const images = {};

  function hash(str) {
    let h = 0;
    for (const c of str) h = (h * 31 + c.charCodeAt(0)) | 0;
    return Math.abs(h);
  }

  function initials(name) {
    return name.replace(/^The /, "").split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();
  }

  function load(crew) {
    return Promise.all(crew.map(p => new Promise(resolve => {
      if (!p.photo) return resolve();
      const img = new Image();
      img.onload = () => { images[p.id] = img; resolve(); };
      img.onerror = () => resolve();
      img.src = p.photo;
    })));
  }

  // Downscale to a tiny grid then let CSS upscale with nearest-neighbour, which gives the 8-bit look for free.
  function render(person) {
    const c = document.createElement("canvas");
    c.width = c.height = GRID;
    const ctx = c.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    const img = images[person.id];
    if (img) {
      const s = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, GRID, GRID);
      posterize(ctx);
    } else {
      const color = PALETTE[hash(person.id) % PALETTE.length];
      ctx.fillStyle = "#1c1a33";
      ctx.fillRect(0, 0, GRID, GRID);
      ctx.fillStyle = color;
      ctx.fillRect(2, 2, GRID - 4, GRID - 4);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (person.emoji) {
        ctx.font = "16px sans-serif";
        ctx.fillText(person.emoji, GRID / 2, GRID / 2 + 1);
      } else {
        ctx.fillStyle = "#1c1a33";
        ctx.font = "bold 11px monospace";
        ctx.fillText(initials(person.name), GRID / 2, GRID / 2 + 1);
      }
    }
    c.style.imageRendering = "pixelated";
    c.setAttribute("role", "img");
    c.setAttribute("aria-label", person.name);
    return c;
  }

  function posterize(ctx) {
    const d = ctx.getImageData(0, 0, GRID, GRID);
    const step = 48;
    for (let i = 0; i < d.data.length; i += 4) {
      for (let k = 0; k < 3; k++) d.data[i + k] = Math.round(d.data[i + k] / step) * step;
    }
    ctx.putImageData(d, 0, 0);
  }

  function group(label) {
    return render({ id: label, name: label });
  }

  return { load, render, group, image: id => images[id] };
})();
