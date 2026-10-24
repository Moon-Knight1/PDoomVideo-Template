// c02_awaken.js — 6.637 – 16.204：飞过大海与山脉，再看沙漠开花。
(() => {
  const plane = (x, y, s, rot, o = {}) => {
    push(); translate(x, y); rotate(rot);
    paint([[s * .5, 0], [-s * .34, -s * .32], [-s * .1, 0], [-s * .28, -s * .12]], {
      wash: PAL.cream, washOp: 255, fill: PAL.cream, fillOp: 60, ink: PAL.ink, sw: 2.2,
    });
    paint([[s * .5, 0], [-s * .1, 0], [-s * .28, s * .12], [-s * .34, s * .32]], {
      wash: PAL.clayLt, washOp: 210, fill: PAL.clayLt, fillOp: 50, ink: PAL.ink, sw: 2.0,
    });
    pop();
  };

  // ---------------- 1. 大海与山脉
  function seaShot(t, lt, dur) {
    const k = clamp(lt / dur);
    camBegin(960 + k * 70, 556 + k * 18, 1.02 + k * .08, 0);

    // 天空：一层一层压上去，做出渐变
    paint(rectPts(-300, -300, W + 600, 900), { wash: '#BFE4F4', washOp: 255, ink: null });
    for (let i = 0; i < 5; i++) {
      paint(rectPts(-300, 300 - i * 130, W + 600, 140), { wash: '#F9E7C2', washOp: 40, bleed: .8, ink: null });
    }
    // 太阳
    paint(ellPts(1540, 200, 76, 76, 24), { wash: PAL.sun, washOp: 255, fill: PAL.sunLt, fillOp: 120, ink: PAL.ink, sw: 2 });
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * TAU + t * .07;
      inkLine([[1540 + cos(a) * 92, 200 + sin(a) * 92], [1540 + cos(a) * 122, 200 + sin(a) * 122]], 1.4, PAL.sunDk, 'inkfine', 0);
    }

    // 海
    paint(rectPts(-300, 560, W + 600, 800), { wash: PAL.sea, washOp: 255, fill: PAL.seaDk, fillOp: 50, bleed: .2, ink: null });
    paint(rectPts(-300, 560, W + 600, 70), { wash: PAL.seaLt, washOp: 90, bleed: .5, ink: null });
    // 每一朵浪都用自己的长度、起伏和位置，别复用一个符号
    let wi = 0;
    for (let row = 0; row < 7; row++) {
      const y = 604 + row * 70, step = 150 + row * 26;
      for (let x = -140; x < W + 140; x += step) {
        const h = hash(wi * 3.7), h2 = hash(wi * 8.1), h3 = hash(wi * 5.3);
        const len = 46 + h * 66, amp = 4 + h2 * 7, yy = y + (h3 - .5) * 26;
        const x0 = x + (h2 - .5) * 60;
        inkLine([[x0, yy], [x0 + len * .35, yy - amp], [x0 + len * .68, yy + amp * .2], [x0 + len, yy + amp * .55]],
          1.1 + h3 * .7, '#FFF6E2', 'dry', .5);
        wi++;
      }
    }

    // 山从海里升起来
    const rise = easeOut(seg(lt, .5, 2.2));
    if (rise > .01) {
      const base = 566, push0 = (1 - rise) * 260;
      const draw = (x, w, h, col, seed) => {
        const pts = [[x - w * .55, base + push0]];
        for (let i = 0; i <= 7; i++) {
          const q = i / 7;
          pts.push([x - w * .55 + w * 1.1 * q, base + push0 - sin(q * PI) * h * (1 + sin(q * 5.2 + seed) * .16)]);
        }
        pts.push([x + w * .55, base + push0]);
        paint(pts, { wash: col, washOp: 255, fill: PAL.night, fillOp: 30, ink: PAL.ink, sw: 2, curv: .35 });
        // 雪顶
        paint([[x - w * .1, base + push0 - h * .74], [x, base + push0 - h * .96], [x + w * .1, base + push0 - h * .72], [x, base + push0 - h * .8]], {
          wash: PAL.cream, washOp: 240, ink: null, curv: .5,
        });
      };
      // 远处那一层先铺，颜色淡到快化在天里
      paint([[-300, 566], [120, 470], [420, 520], [760, 440], [1080, 512], [1400, 462], [1750, 520], [2100, 486], [2100, 600], [-300, 600]],
        { wash: LIB.haze('#8AA0B6', .62, '#CFE6F2'), washOp: 255, ink: null, curv: .5 });
      draw(300, 566, 190, LIB.haze('#7C93AC', .38, '#CFE6F2'), 1.2);
      draw(880, 566, 240, LIB.haze('#6A83A0', .16, '#CFE6F2'), 3.4);
      draw(1450, 566, 180, LIB.haze('#8AA0B6', .45, '#CFE6F2'), 5.1);
    }

    // 飞机贴着海面飞
    const px = lerp(-200, 2100, k), py = lerp(400, 286, k) + sin(k * PI * 2.4) * 24;
    plane(px, py, 240, -.06 + sin(t * 2.4) * .03);
    // 尾迹
    for (let i = 1; i < 8; i++) {
      paint(ellPts(px - i * 40, py + 26 + i * 8, 16 - i, 8 - i * .6, 8), { wash: '#FFF6E2', washOp: 110 - i * 10, ink: null });
    }
    // 前景：压深一倍的水面，把画幅下缘收住
    LIB.fgBand(1006, { col: PAL.seaDk, op: 120, ink: false });
    camEnd();
  }

  // ---------------- 2. 沙漠开花
  function desertShot(t, lt, dur) {
    const k = clamp(lt / dur);
    camBegin(900 + k * 80, 556 + k * 14, 1.02 + k * .09, 0);

    paint(rectPts(-300, -300, W + 600, 900), { wash: '#F7DCAE', washOp: 255, ink: null });
    paint(ellPts(1300, 260, 520, 300, 24), { fill: PAL.rose, fillOp: 45, bleed: 1.2, ink: null });

    // 三层沙丘
    const dunes = [{ y: 560, c: '#EBC98F' }, { y: 680, c: '#DCAE6C' }, { y: 830, c: '#C9924F' }];
    dunes.forEach((d, i) => {
      const pts = [[-300, d.y + 300]];
      for (let x = -300; x <= W + 300; x += 160) {
        pts.push([x, d.y + sin(x * .0022 + i * 2) * 40 + sin(x * .0011 + t * .3 + i) * 12]);
      }
      pts.push([W + 300, d.y + 300]);
      paint(pts, { wash: LIB.haze(d.c, (2 - i) * .16, '#F7DCAE'), washOp: 255, fill: PAL.sandDk, fillOp: 40, ink: PAL.ink, sw: 1.8, curv: .6 });
    });

    // 飞机飞过，身后花开
    const front = -300 + (W + 700) * ease(seg(lt, .1, 2.6));
    const px = lerp(-260, 2100, k), py = 470 - sin(k * PI) * 70;
    plane(px, py, 250, -.08);

    for (let i = 0; i < 42; i++) {
      const x = 60 + hash(i * 2.3) * 1800;
      if (x > front) continue;
      const y = 650 + hash(i * 5.7) * 300, s = 12 + hash(i * 9.1) * 16;
      const pop = clamp(((front - x) / 400) * 3);
      const col = [PAL.rose, PAL.sun, PAL.clay, PAL.violet, PAL.teal][i % 5];
      inkLine([[x, y + s * 1.5], [x, y]], 1.6, PAL.grassDk, 'inkfine', .4);
      // 花瓣：五片从花心往外摊，互相压着，不要留出"瞳孔"
      for (let p = 0; p < 5; p++) {
        const a = p / 5 * TAU + i * .7;
        paint(ellPts(x + cos(a) * s * .52 * pop, y - s * .18 + sin(a) * s * .52 * pop,
          s * .62 * pop, s * .42 * pop, 10, 0, a + .3), { wash: col, washOp: 240, ink: null });
      }
      paint(ellPts(x, y - s * .18, s * .26 * pop, s * .26 * pop, 10), { wash: PAL.sun, fill: PAL.sunLt, fillOp: 90, ink: null });
    }
    // 前景：近处一道更深的沙脊
    LIB.fgBand(1014, { col: PAL.sandDk, op: 170, ink: false });
    camEnd();
  }

  chapter('awaken', 6.637, 16.204, [[6.637, seaShot], [9.873, desertShot]]);
})();
