// c05_space.js — 29.624 – 39.790：戳破烦恼，飞进宇宙，再掉头回家。
(() => {
  // ---------------- 1. 忘记烦恼
  function popWorries(t, lt, dur) {
    camBegin(960, 540 - clamp(lt / dur) * 20, 1.02 + clamp(lt / dur) * .08, 0);
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#CFE7F5', washOp: 255, ink: null });
    paint(rectPts(-300, 620, W + 600, 700), { wash: '#FBEBCB', washOp: 120, bleed: 1.2, ink: null });
    LIB.sun(1640, 180, 66, t);

    const N = 6;
    for (let i = 0; i < N; i++) {
      const appear = .1 + i * .13;
      const age = (lt / dur - appear) * dur;
      if (age < 0) continue;
      const x = 250 + i * 265, y = 300 + sin(i * 2.1) * 90;
      const pop = clamp(age / .32);
      if (pop >= 1) {
        for (let p = 0; p < 6; p++) {
          const a = p / 6 * TAU + i;
          const r = 40 + pop * 46;
          paint(ellPts(x + cos(a) * r, y + sin(a) * r, 8, 6, 8),
            { wash: [PAL.clay, PAL.sun, PAL.rose][p % 3], washOp: 150 * max(0, 1 - (pop - 1) * .5), ink: null });
        }
        continue;
      }
      const sc = 1 - easeIn(pop);
      LIB.cloud(x, y, 220 * sc, { seed: i, col: '#9FA6B8', shade: '#6C7490', op: 230, fillOp: 110 });
      if (sc > .4) {
        for (const sd of [-1, 1]) inkLine([[x + sd * 34 - 8, y - 6], [x + sd * 34 + 10, y - 12]], 3 * sc, PAL.ink, 'ink', 0);
        inkLine([[x - 26 * sc, y + 22], [x, y + 14], [x + 26 * sc, y + 22]], 2.6 * sc, PAL.ink, 'ink', .5);
      }
    }

    const px = lerp(100, 1800, clamp(lt / dur)), py = 560 + sin(t * 2.4) * 30;
    LIB.plane(px, py, 270, -.05);

    // 小笑脸
    for (let i = 0; i < 14; i++) {
      const x = 120 + hash(i * 3.7) * 1700, y = 140 + hash(i * 7.9) * 300;
      inkLine([[x - 10, y], [x, y + 9], [x + 10, y]], 2.4, PAL.rose, 'ink', .5);
    }
    camEnd();
  }

  // ---------------- 2. 宇宙很大
  function bigSpace(t, lt, dur) {
    const k = clamp(lt / dur);
    camBegin(960, 520, .92 + k * .2, -.02);
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#232A56', washOp: 255, ink: null });

    // 星云
    for (let i = 0; i < 4; i++) {
      paint(ellPts(300 + i * 420, 240 + sin(i * 2.1) * 260, 280 + i * 30, 170 + i * 20, 18, 30),
        { fill: [PAL.violet, PAL.indigo, PAL.rose, PAL.teal][i % 4], fillOp: 45, bleed: 1.2, ink: null });
    }
    // 星星
    for (let i = 0; i < 90; i++) {
      const tw = .55 + .45 * sin(t * 2 + i);
      paint(ellPts(hash(i * 1.7) * W, hash(i * 4.9) * H, 1.6, 1.6, 6), { wash: PAL.cream, washOp: 190 * tw, ink: null });
    }

    // 纸片行星
    const planets = [
      { x: 380, y: 720, r: 118, c: PAL.clay, ring: false },
      { x: 1480, y: 260, r: 76, c: PAL.teal, ring: true },
      { x: 1620, y: 760, r: 50, c: PAL.sun, ring: false },
    ];
    planets.forEach((p) => {
      paint(ellPts(p.x, p.y, p.r, p.r, 24, 3), { wash: p.c, washOp: 250, fill: PAL.night, fillOp: 40, ink: PAL.ink, sw: 2.2, curv: .4 });
      paint(ellPts(p.x - p.r * .3, p.y - p.r * .35, p.r * .3, p.r * .2, 14), { wash: PAL.cream, washOp: 80, ink: null });
      if (p.ring) inkLine(LIB.arc(p.x, p.y, p.r * 1.5, 0, TAU, 36), 6, '#FFF6E2', 'dry', .5);
    });

    const px = lerp(260, 1620, easeOut(k)), py = 470 + sin(k * 3) * 40;
    LIB.plane(px, py, 175, -.2);
    // 星尘掠过
    for (let i = 0; i < 20; i++) {
      const x = ((hash(i * 3.1) * 2200 - t * (120 + hash(i) * 160)) % 2200 + 2200) % 2200 - 140;
      const y = hash(i * 7.7) * H;
      inkLine([[x, y], [x + 40, y]], 1.8, '#FFF6E2', 'dry', 0);
    }
    camEnd();
  }

  // ---------------- 3. 回航
  function homeward(t, lt, dur) {
    const k = clamp(lt / dur);
    camBegin(960, 530, 1.0 + k * .10, 0);
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#BBD8EE', washOp: 255, ink: null });
    paint(rectPts(-300, 640, W + 600, 700), { wash: '#FBEBCB', washOp: 130, bleed: 1.2, ink: null });

    // 回家的那颗蓝星球
    paint(ellPts(250, 900, 330, 330, 30, 4), { wash: PAL.sea, washOp: 250, fill: PAL.sky, fillOp: 50, ink: PAL.ink, sw: 2.4, curv: .5 });
    for (let i = 0; i < 4; i++) {
      paint(ellPts(130 + i * 90, 780 + hash(i * 3) * 120, 68, 38, 12, 6, .3), { wash: PAL.grass, washOp: 230, ink: PAL.ink, sw: 1.6, curv: .5 });
    }

    // 掉头的弧线
    const a = lerp(-.6, 2.2, easeIn(k));
    const px = 1180 + cos(a) * 480, py = 420 + sin(a) * 220;
    for (let i = 1; i < 11; i++) {
      const aa = a - i * .13;
      const x = 1180 + cos(aa) * 480, y = 420 + sin(aa) * 220;
      if (i % 3 === 0) paint(LIB.heart(x, y, 18 - i), { wash: PAL.rose, washOp: 180 - i * 12, ink: null });
      else paint(starPts(x, y, 11 - i * .5, .3, 4, 0), { wash: PAL.sunLt, washOp: 190 - i * 12, ink: null });
    }
    LIB.plane(px, py, 230, a + PI * .5);

    camEnd();
  }

  chapter('space', 29.624, 39.790, [[29.624, popWorries], [33.301, bigSpace], [36.535, homeward]]);
})();
