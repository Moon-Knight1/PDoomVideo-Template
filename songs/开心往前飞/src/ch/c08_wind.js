// c08_wind.js — 58.928 – 67.472：风、带翅膀的流星、穿过时间。
(() => {
  // ---------------- 1. 风
  function theWind(t, lt, dur) {
    const k = clamp(lt / dur);
    camBegin(960 + (k - .5) * 130, 560, 1.0 + k * .08, 0);
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#D8ECF2', washOp: 255, ink: null });
    paint(rectPts(-300, 560, W + 600, 800), { wash: '#FCEFD2', washOp: 130, bleed: 1.2, ink: null });

    // 被风吹斜的草
    for (let i = 0; i < 54; i++) {
      const x = -40 + i * 36 + hash(i * 3.1) * 18;
      const h = 110 + hash(i * 7.7) * 150;
      const bend = sin(t * 2.2 + i * .3) * 24 + 30;
      inkLine([[x, 900], [x + bend * .4, 900 - h * .55], [x + bend, 900 - h]], 2.6,
        i % 3 ? PAL.grassDk : PAL.grass, 'ink', .55);
    }
    // 花瓣
    for (let i = 0; i < 20; i++) {
      const ph = frac(t * .55 + i * .17);
      paint(ellPts(-100 + ph * 2200, 420 + sin(ph * 8 + i) * 160 - ph * 110, 9, 5, 8, 0, t * 3 + i),
        { wash: [PAL.rose, PAL.cream, PAL.sunLt][i % 3], washOp: 200, ink: null });
    }

    const px = lerp(140, 1760, easeOut(k)), py = 520 - sin(k * PI) * 110 + sin(t * 3) * 10;
    LIB.plane(px, py, 255, -.22 + sin(t * 2) * .05);

    // 风线
    for (let i = 0; i < 10; i++) {
      const y = 200 + hash(i * 2.7) * 620;
      const x = ((t * (240 + hash(i * 4.1) * 200) + hash(i * 6.1) * 2000) % (W + 700)) - 350;
      inkLine([[x, y], [x + 90, y - 10], [x + 180, y]], 1.8, '#FFF6E2', 'dry', .6);
    }
    camEnd();
  }

  // ---------------- 2. 带翅膀的流星
  function meteor(t, lt, dur) {
    const k = clamp(lt / dur);
    camBegin(960, 520, 1.0 + k * .13, .02);
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#1E2448', washOp: 255, ink: null });
    paint(ellPts(300, 1000, 900, 380, 24), { fill: PAL.indigo, fillOp: 70, bleed: 1.4, ink: null });
    for (let i = 0; i < 70; i++) {
      paint(ellPts(hash(i * 1.7) * W, hash(i * 4.9) * H, 1.8, 1.8, 6), { wash: PAL.cream, washOp: 170, ink: null });
    }

    const mx = lerp(-260, 2200, k), my = 600 - k * 300;
    const ang = -.25;

    // 尾巴
    for (let i = 1; i < 15; i++) {
      const a = 1 - i / 15;
      paint(ellPts(mx - cos(ang) * i * 50, my - sin(ang) * i * 50, 24 * a, 18 * a, 10),
        { wash: mixCol(PAL.sunLt, PAL.clay, i / 15), washOp: 180 * a, bleed: .4, ink: null });
    }

    // 星星本体 + 翅膀
    push(); translate(mx, my); rotate(ang);
    paint([[-30, 0], [-150, -120], [-60, -30], [20, -40]], { wash: PAL.cream, washOp: 240, ink: PAL.ink, sw: 2.2, curv: .6 });
    paint([[-30, 0], [-150, 120], [-60, 30], [20, 40]], { wash: PAL.cream, washOp: 240, ink: PAL.ink, sw: 2.2, curv: .6 });
    paint(starPts(20, 0, 60, .42, 5, -.3), { wash: PAL.sun, washOp: 250, fill: PAL.sunLt, fillOp: 110, ink: PAL.ink, sw: 2.4 });
    pop();

    LIB.plane(mx - 400, my + 140, 200, ang);
    camEnd();
  }

  // ---------------- 3. 穿页而过
  function timeTunnel(t, lt, dur) {
    const k = clamp(lt / dur);
    const spin = k * 3;
    camBegin(960, 540, 1.1 + k * .45, spin * .1);
    paint(rectPts(-600, -600, W + 1200, H + 1200), { wash: '#262B52', washOp: 255, ink: null });

    for (let i = 10; i >= 0; i--) {
      const r = 120 + i * 120 - (t * 40 % 120);
      const col = [PAL.violet, PAL.indigo, PAL.rose, PAL.teal][i % 4];
      push(); rotate(spin + i * .3);
      for (let s = 0; s < 8; s++) {
        const a = s / 8 * TAU;
        push(); translate(cos(a) * r, sin(a) * r * .7); rotate(a + spin);
        paint(rectPts(-46, -60, 92, 120, 2), { wash: PAL.cream, washOp: 200, fill: col, fillOp: 30, ink: PAL.ink, sw: 1.6 });
        inkLine([[-30, -30], [30, -34]], 1.4, PAL.ink, 'inkfine', 0);
        inkLine([[-30, -6], [20, -10]], 1.4, PAL.ink, 'inkfine', 0);
        pop();
      }
      pop();
    }

    // 钟表的指针
    inkLine([[960, 540], [960 + cos(t * 2) * 150, 540 + sin(t * 2) * 150]], 6, PAL.cream, 'ink', 0);
    inkLine([[960, 540], [960 + cos(t * 5) * 240, 540 + sin(t * 5) * 240]], 3.4, PAL.clay, 'ink', 0);

    LIB.plane(960, 540, 310, -.1);

    for (let i = 0; i < 20; i++) {
      const a = hash(i * 3.7) * TAU, r = 200 + hash(i * 7.3) * 680;
      const x = 960 + cos(a) * r, y = 540 + sin(a) * r;
      inkLine([[x, y], [x + (x - 960) * .17, y + (y - 540) * .17]], 2.2, '#FFF6E2', 'dry', 0);
    }
    flash(easeIn(seg(k, .82, 1)) * .85, '#FFF6E2');
    camEnd();
  }

  chapter('wind', 58.928, 67.472, [[58.928, theWind], [61.173, meteor], [65.450, timeTunnel]]);
})();
