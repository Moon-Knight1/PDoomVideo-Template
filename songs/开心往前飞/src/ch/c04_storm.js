// c04_storm.js — 23.150 – 29.624：一场风雨，然后撞破它。
(() => {
  // ---------------- 1. 风雨里往前
  function storm(t, lt, dur) {
    const k = clamp(lt / dur);
    camBegin(960 + sin(t * 9) * 5, 540, 1.02 + k * .10, sin(t * 2) * .01);
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#3E4668', washOp: 255, ink: null });
    paint(rectPts(-300, 120, W + 600, 520), { wash: '#5A5F86', washOp: 110, bleed: 1.4, ink: null });

    // 压下来的云
    for (let i = 0; i < 6; i++) {
      const x = ((i * 380 - t * 40) % (W + 700) + W + 700) % (W + 700) - 350;
      LIB.cloud(x, 100 + hash(i * 3.3) * 220, 420, { seed: i, col: '#6E7096', shade: '#3F4468', op: 230, fillOp: 110 });
    }
    for (let i = 0; i < 5; i++) {
      const x = ((i * 430 + t * 90) % (W + 700) + W + 700) % (W + 700) - 350;
      LIB.cloud(x, 700 + hash(i * 7.1) * 140, 520, { seed: i + 9, col: '#585D82', shade: '#333857', op: 235, fillOp: 120 });
    }

    // 雨
    for (let i = 0; i < 120; i++) {
      const x = hash(i * 1.7) * (W + 400) - 200;
      const y = (hash(i * 4.3) * H + t * 900) % (H + 200) - 100;
      inkLine([[x, y], [x - 10, y + 42]], 1.4, '#D6E2F2', 'inkfine', 0);
    }

    // 闪电
    const lf = max(0, sin(t * 1.7) * sin(t * 3.1));
    if (lf > .93) {
      flash(clamp((lf - .93) * 11), '#EAE4FF');
      const pts = [[1500, 200]];
      for (let i = 1; i <= 8; i++) pts.push([1500 + (hash(i * 3.1 + t) - .5) * 120, 200 + i * 70]);
      inkLine(pts, 5, '#FFFDF6', 'ink', 0);
    }

    // 飞机顶着风
    const px = lerp(-150, 1400, k), py = 380 + sin(t * 5) * 16;
    LIB.plane(px, py, 250, -.16 + sin(t * 5) * .08);

    camEnd();
  }

  // ---------------- 2. 撞破云墙
  function breakthrough(t, lt, dur) {
    const burst = easeOut(seg(lt, .05, 1.1));
    camBegin(960, 520, 1 + burst * .08, 0);
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#8FC7E8', washOp: 255, ink: null });
    paint(rectPts(-300, 560, W + 600, 800), { wash: '#F9E9C6', washOp: 130, bleed: 1.2, ink: null });
    LIB.sun(1500, 300, 100, t);

    // 背后的黑云墙
    paint([[-300, -300], [700, -300], [620, 300], [430, 780], [-300, 900]], { wash: '#4A4F74', washOp: 120, fill: '#2F3454', fillOp: 50, bleed: 1.2, ink: null });

    // 彩虹
    const cols = [PAL.clay, PAL.sun, PAL.grass, PAL.sky, PAL.violet];
    for (let i = 0; i < 5; i++) {
      inkLine(LIB.arc(900, 980, 520 - i * 34, PI * 1.08, PI * 1.92, 32), 14, cols[i], 'dry', .5);
    }

    // 云散开
    LIB.cloud(360, 250, 420, { seed: 3, op: 225 });
    LIB.cloud(1580, 700, 520, { seed: 8, op: 230 });

    // 飞机跃出来
    const px = lerp(380, 1250, easeOut(clamp(lt / dur))), py = lerp(560, 300, easeOut(clamp(lt / dur)));
    for (let i = 1; i < 12; i++) paint(ellPts(px - i * 34, py + 24 + i * 2, 12 - i, 12 - i, 8), { wash: '#FFF6E2', washOp: 130 - i * 9, ink: null });
    LIB.plane(px, py, 270, -.34);

    for (let i = 0; i < 8; i++) paint(starPts(300 + hash(i * 3.7) * 1300, 200 + hash(i * 7.1) * 480, 12 + hash(i) * 10, .28, 4, 0), { wash: PAL.cream, washOp: 220, ink: null });

    flash(1 - burst, '#FFFDF6');
    camEnd();
  }

  chapter('storm', 23.150, 29.624, [[23.150, storm], [25.092, breakthrough]]);
})();
