// c03_fly.js — 16.204 – 23.150：先好好飞，再拖着"一吨行李"绕地球。
(() => {
  // ---------------- 1. 翻一个圈
  function joy(t, lt, dur) {
    const k = clamp(lt / dur);
    camBegin(960 + k * 40, 520 - k * 20, 1.0 + k * .10, 0);
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#BDE3F3', washOp: 255, ink: null });
    paint(ellPts(1520, 300, 760, 520, 24), { fill: PAL.sunLt, fillOp: 45, bleed: 1.6, ink: null });
    LIB.sun(1520, 210, 78, t);

    for (let i = 0; i < 4; i++) {
      const x = ((i * 520 - t * 60) % (W + 700) + W + 700) % (W + 700) - 350;
      LIB.cloud(x, 250 + hash(i * 3.3) * 230, 340 + hash(i) * 120, { seed: i, op: 205 });
    }

    // 飞机绕一个大圈
    const a = k * TAU * .9 - .4;
    const cx = 960, cy = 470, rx = 610, ry = 245;
    const px = cx + cos(a) * rx, py = cy + sin(a) * ry * .8;
    const rot = Math.atan2(cos(a) * ry * .8, -sin(a) * rx);
    for (let i = 1; i < 22; i++) {
      const aa = a - i * .055;
      if (aa < -.4) break;
      paint(ellPts(cx + cos(aa) * rx, cy + sin(aa) * ry * .8, 7 - i * .22, 7 - i * .22, 8),
        { wash: '#FFF6E2', washOp: 110 - i * 4, ink: null });
    }
    LIB.plane(px, py, 250, rot);

    // 彩纸屑
    for (let i = 0; i < 12; i++) {
      const ph = frac(t * .7 + i * .37);
      if (ph > .9) continue;
      paint(starPts(200 + hash(i * 3.3) * 1500 + sin(t + i) * 20, -40 + ph * 760, 9, .3, 4, 0),
        { wash: [PAL.clay, PAL.sun, PAL.rose, PAL.teal][i % 4], washOp: 200, ink: null });
    }
    camEnd();
  }

  // ---------------- 2. 一吨行李
  function haul(t, lt, dur) {
    const k = clamp(lt / dur);
    camBegin(960, 536 - k * 16, 1.0 + k * .08, 0);
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#F3E7CE', washOp: 255, ink: null });

    // 地球
    paint(ellPts(960, 1240, 1120, 700, 30), { wash: PAL.sea, washOp: 255, fill: PAL.seaLt, fillOp: 55, bleed: .4, ink: PAL.ink, sw: 2.4, curv: .5 });
    for (let i = 0; i < 5; i++) {
      paint(ellPts(420 + i * 330, 960 - hash(i * 3.7) * 90, 120 + hash(i) * 80, 56 + hash(i * 2) * 28, 14, 14, .2),
        { wash: PAL.grass, washOp: 235, fill: PAL.grassLt, fillOp: 50, ink: PAL.ink, sw: 1.8, curv: .5 });
    }
    for (let i = 0; i < 3; i++) inkLine(LIB.arc(960, 1240, 900 - i * 130, PI * 1.15, PI * 1.85, 22), 1.6, '#FFF6E2', 'dry', .5);

    // 虚线航路
    for (let i = 0; i < 11; i++) {
      const x = 120 + i * 160, y = 430 - sin(i / 11 * PI) * 200;
      inkLine([[x - 22, y + 16], [x + 22, y - 16]], 3.4, PAL.ink, 'dry', 0);
    }

    const px = lerp(-200, 2120, k), py = 400 - sin(k * PI) * 140 + sin(t * 2) * 8;
    const pull = sin(t * 4) * 12;

    // 绳子：机尾 → 箱子把手
    inkLine([[px - 92, py + 92], [px - 200 + pull, py + 158], [px - 320 + pull, py + 232]], 4.4, PAL.ink, 'ink', .4);

    // 箱子落在地球上的影子
    LIB.shadow(px - 330 + pull, py + 392, 150, 24, 50);
    // 箱子（比主角还大）
    push(); translate(px - 330 + pull, py + 300); rotate(sin(t * 3) * .1);
    paint(rrPts(-120, -80, 240, 160, 18, 3), { wash: '#C9773C', washOp: 255, fill: '#A85E2E', fillOp: 70, ink: PAL.ink, sw: 3, curv: .3 });
    inkLine([[-120, -22], [120, -22]], 3, '#8A4A22', 'ink', 0);
    paint(rrPts(-26, -104, 52, 28, 12), { wash: '#8A4A22', ink: PAL.ink, sw: 2.2 });
    for (const sd of [-1, 1]) paint(rrPts(sd * 74 - 11, -38, 22, 22, 7), { wash: PAL.sun, ink: PAL.ink, sw: 1.8 });
    // 行李牌
    inkLine([[96, 40], [142, 62]], 1.8, PAL.ink, 'inkfine', 0);
    paint(rrPts(140, 58, 84, 40, 8, 1), { wash: PAL.cream, ink: PAL.ink, sw: 1.6 });
    pop();
    letter('1 T', px - 330 + pull + 182, py + 300 + 80, 24, PAL.clayDk, { rot: .08 });

    LIB.plane(px, py, 240, -.12 + sin(t * 2.2) * .03);

    // 里程表
    const dist = Math.floor(easeIn(k) * 9999999);
    letter(dist.toLocaleString('en-US'), 1600, 160, 48, PAL.ink, { align: 'right', alpha: .85, font: '48px "Shantell Sans", sans-serif' });
    letter('km', 1620, 162, 26, PAL.ink, { align: 'left', alpha: .6, font: '26px "Shantell Sans", sans-serif' });
    camEnd();
  }

  chapter('fly', 16.204, 23.150, [[16.204, joy], [19.313, haul]]);
})();
