// c06_venture.js — 39.790 – 47.983：纸片城市、书塔、和贴近的云。
(() => {
  // ---------------- 1. 城中峡谷
  function cityRun(t, lt, dur) {
    const k = clamp(lt / dur);
    camBegin(960 + (k - .5) * 210, 560, 1.04 + k * .08, 0);
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#CFE7F5', washOp: 255, ink: null });

    // 三排楼，越近越大
    const rows = [{ y: 700, s: .55, c: '#B9CBD9' }, { y: 820, s: .8, c: '#9BB3C6' }, { y: 980, s: 1.1, c: '#7E97AD' }];
    rows.forEach((R, ri) => {
      for (let i = 0; i < 7; i++) {
        const w = (110 + hash(i * 3.3 + ri) * 110) * R.s;
        const h = (170 + hash(i * 7.1 + ri) * 300) * R.s;
        const x = -120 + i * 290 * R.s + (ri % 2) * 50;
        const y = R.y - h;
        paint(rectPts(x, y, w, h, 2), { wash: LIB.haze(R.c, (2 - ri) * .22, '#CFE7F5'), washOp: 255, fill: PAL.night, fillOp: 30, ink: PAL.ink, sw: 1.6 });
        for (let q = 0; q < 4; q++) {
          paint(rectPts(x + 22 * R.s, y + 28 + q * 44 * R.s, w - 44 * R.s, 18 * R.s, 1),
            { wash: '#FFE9A8', washOp: 150, ink: null });
        }
      }
    });

    const px = lerp(-260, 2180, k);
    const py = 500 + sin(k * PI * 3) * 100;
    LIB.plane(px, py, 275, -.02 + cos(k * PI * 3) * .16);

    // 前景屋顶掠过
    for (let i = 0; i < 4; i++) {
      const x = ((i * 620 - t * 420) % 2480 + 2480) % 2480 - 280;
      paint(rectPts(x, 980, 420, 260, 2), { wash: '#6C7F94', washOp: 255, fill: PAL.night, fillOp: 40, ink: PAL.ink, sw: 2 });
      for (let w = 0; w < 4; w++) paint(rectPts(x + 40 + w * 96, 1010, 54, 44, 1), { wash: '#FFE9A8', washOp: 170, ink: null });
    }
    camEnd();
  }

  // ---------------- 2. 书塔
  function bookTower(t, lt, dur) {
    const k = clamp(lt / dur);
    const climb = easeIn(seg(lt, 0, 1.1));
    camBegin(960, 700 - climb * 400, 1 + climb * .16, 0);
    paint(rectPts(-300, -900, W + 600, H + 1800), { wash: '#BFDDF0', washOp: 255, ink: null });
    LIB.sun(1620, 240 - climb * 280, 84, t);

    const cols = [PAL.clay, PAL.teal, PAL.sun, PAL.violet, PAL.sky, PAL.rose, PAL.grass];
    for (let i = 0; i < 9; i++) {
      const w = 420 - i * 22, x = 960 - w / 2 + (i % 2 ? 16 : -12), y = 880 - i * 92;
      const books = max(1, Math.round(w / 90));
      for (let b = 0; b < books; b++) {
        const bw = w / books;
        paint(rrPts(x + b * bw + 3, y - 76, bw - 6, 76, 6, 2), {
          wash: cols[(i + b) % cols.length], washOp: 250, fill: PAL.night, fillOp: 20, ink: PAL.ink, sw: 1.8, curv: .15,
        });
        inkLine([[x + b * bw + 14, y - 58], [x + b * bw + bw - 16, y - 58]], 1.6, '#FFF6E2', 'dry', 0);
        inkLine([[x + b * bw + 14, y - 26], [x + b * bw + bw - 16, y - 26]], 1.6, '#FFF6E2', 'dry', 0);
      }
    }

    // 螺旋上升
    const a = k * TAU * 1.6;
    const px = 960 + cos(a) * (300 - k * 110);
    const py = 820 - k * 780 + sin(a) * 36;
    LIB.plane(px, py, 200 - k * 40, -PI * .35 + cos(a) * .3);

    inkLine([[300, -120], [1200, -160], [1700, -120]], 2.6, PAL.ink, 'dry', .5);
    camEnd();
  }

  // ---------------- 3. 云层贴脸
  function closeClouds(t, lt, dur) {
    camBegin(960, 520, 1.10 + clamp(lt / dur) * .06, .01);
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#CBE6F4', washOp: 255, ink: null });
    paint(rectPts(-300, 700, W + 600, 700), { wash: '#FFF1D2', washOp: 130, bleed: 1.2, ink: null });

    for (let i = 0; i < 5; i++) {
      const x = 300 + i * 380 + sin(t * .4 + i) * 40;
      const y = 260 + hash(i * 3.3) * 400 + cos(t * .5 + i) * 20;
      const s = 1 - abs(i - 2) * .16;
      LIB.cloud(x, y, 600 * s, { seed: i, op: 230, fillOp: 95 });
    }

    // 飘过的花瓣
    for (let i = 0; i < 18; i++) {
      const ph = frac(t * .18 + i * .13);
      const x = 200 + hash(i * 3.1) * 1600 + sin(t + i) * 30;
      paint(ellPts(x, ph * 900 - 80, 9, 5, 8, 0, t + i), { wash: [PAL.rose, PAL.sunLt, PAL.cream][i % 3], washOp: 200, ink: null });
    }
    camEnd();
  }

  chapter('venture', 39.790, 47.983, [[39.790, cityRun], [43.088, bookTower], [45.647, closeClouds]]);
})();
