// lib.js — 本首歌的公共绘图零件（在章节之前加载）。
// 只放"画形状"的纯函数；放不下画笔状态，也不存任何跨帧数据。
const LIB = {
  // 圆弧上的点
  arc(cx, cy, r, a0, a1, n = 16, j = 0) {
    const p = [];
    for (let i = 0; i <= n; i++) {
      const a = a0 + (a1 - a0) * i / n;
      p.push([cx + Math.cos(a) * r + jit(j), cy + Math.sin(a) * r + jit(j)]);
    }
    return p;
  },

  // 心形
  heart(cx, cy, r, n = 28) {
    const p = [];
    for (let i = 0; i < n; i++) {
      const a = i / n * TAU;
      const x = 16 * Math.pow(Math.sin(a), 3);
      const y = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a));
      p.push([cx + x * r / 16, cy + y * r / 16]);
    }
    return p;
  },

  // 纸飞机：s = 机身长度，rot = 朝向
  plane(x, y, s, rot, o = {}) {
    push(); translate(x, y); rotate(rot);
    const k = o.squash || 1;
    paint([[s * .5, 0], [-s * .34, -s * .32 * k], [-s * .1, 0], [-s * .28, -s * .12 * k]], {
      wash: o.lit || PAL.cream, washOp: 255, fill: PAL.cream, fillOp: 55, ink: PAL.ink, sw: o.sw || 2.2,
    });
    paint([[s * .5, 0], [-s * .1, 0], [-s * .28, s * .12 * k], [-s * .34, s * .32 * k]], {
      wash: o.shade || PAL.clayLt, washOp: 215, fill: PAL.clayLt, fillOp: 45, ink: PAL.ink, sw: (o.sw || 2.2) - .3,
    });
    pop();
  },

  // 云朵：w = 宽度
  cloud(x, y, w, o = {}) {
    const h = w * (o.h || .4), seed = o.seed || 1, pts = [];
    for (let i = 0; i <= 9; i++) {
      const a = PI + i / 9 * PI, r = 1 + Math.sin(i * 2.3 + seed) * .18;
      pts.push([x + Math.cos(a) * w * .5 * r, y + Math.sin(a) * h * .62 * r]);
    }
    for (let i = 9; i >= 0; i--) {
      const a = i / 9 * PI, r = 1 + Math.sin(i * 1.7 + seed * 2) * .14;
      pts.push([x + Math.cos(a) * w * .5 * r, y + Math.sin(a) * h * .4 * r]);
    }
    paint(pts, {
      wash: o.col || PAL.cream, washOp: o.op || 235,
      fill: o.shade || '#D9E6F0', fillOp: o.fillOp || 80,
      bleed: .5, ink: o.ink === undefined ? null : o.ink, sw: 1.6, curv: .7,
    });
  },

  // 太阳（带放射线）
  sun(x, y, r, t, o = {}) {
    for (let i = 0; i < 14; i++) {
      const a = i / 14 * TAU + t * .08;
      const len = r * (1.32 + .22 * Math.sin(t * 1.3 + i));
      inkLine([[x + Math.cos(a) * r * 1.05, y + Math.sin(a) * r * 1.05],
      [x + Math.cos(a) * len, y + Math.sin(a) * len]], Math.max(1, r * .05), o.ray || PAL.sunDk, 'inkfine', 0);
    }
    paint(ellPts(x, y, r, r, 26, r * .04), {
      wash: o.col || PAL.sun, washOp: 255, fill: PAL.sunLt, fillOp: 120, bleed: .3, ink: PAL.ink, sw: Math.max(1.4, r * .04), curv: .4,
    });
  },

  // 月亮（用纸色挖一个缺口）
  moon(x, y, r) {
    paint(ellPts(x, y, r, r, 24, r * .04), { wash: '#F8EDC4', washOp: 255, fill: PAL.cream, fillOp: 110, ink: PAL.ink, sw: 2, curv: .4 });
    paint(ellPts(x + r * .48, y - r * .22, r * .86, r * .86, 22), { wash: PAL.paper, washOp: 255, ink: null });
  },

  // 一排短浪
  waves(y, t, o = {}) {
    const step = o.step || 130, amp = o.amp || 8, col = o.col || '#FFF6E2';
    for (let x = -120; x < W + 120; x += step) {
      const ph = t * (o.speed || 20);
      inkLine([[x + ph % step, y], [x + 30 + ph % step, y - amp], [x + 60 + ph % step, y], [x + 90 + ph % step, y + amp * .6]],
        1.3, col, 'dry', .5);
    }
  },

  // 空气透视：k 越大越远，越淡、越偏天色
  haze(col, k, sky) {
    return mixCol(col, sky || '#DCE9F2', clamp(k));
  },

  // 落在地面/水面上的软投影
  shadow(x, y, rx, ry, op = 55) {
    paint(ellPts(x, y, rx, ry, 18, rx * .02), { fill: PAL.ink, fillOp: op, bleed: .35, ink: null });
  },

  // 前景压角：一条暗色坡/草，把画面下缘收住
  fgBand(y, o = {}) {
    const col = o.col || PAL.night, pts = [[-200, y + 40]];
    for (let x = -200; x <= W + 200; x += 180) {
      pts.push([x, y + Math.sin(x * .004 + (o.seed || 0)) * (o.amp || 26) + jit(6)]);
    }
    pts.push([W + 200, y + 40], [W + 200, H + 200], [-200, H + 200]);
    paint(pts, { wash: col, washOp: o.op || 210, fill: PAL.ink, fillOp: 20, bleed: .5, ink: o.ink === false ? null : PAL.ink, sw: o.sw || 2.2, curv: .6 });
  },
};
