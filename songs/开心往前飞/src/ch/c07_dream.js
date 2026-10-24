// c07_dream.js — 47.983 – 58.928：云开出房间的轮廓，俯冲，昼夜，群舞。
(() => {
  // ---------------- 1. 梦的轮廓
  function dreamOutline(t, lt, dur) {
    camBegin(960, 540, 1.0 + clamp(lt / dur) * .10, 0);
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#E7DDF0', washOp: 255, ink: null });
    paint(rectPts(-300, 620, W + 600, 700), { wash: '#F8E7CE', washOp: 110, bleed: 1.2, ink: null });

    // 云往两边让开
    const open = ease(seg(lt, 0, 1.8));
    LIB.cloud(400 - open * 380, 300, 620, { seed: 2, op: 230, fillOp: 90 });
    LIB.cloud(1500 + open * 380, 420, 700, { seed: 5, op: 230, fillOp: 90 });
    LIB.cloud(900, 120 - open * 120, 520, { seed: 8, op: 210 });

    // 房间轮廓
    const ghost = seg(lt, .5, 2.2) * (1 - seg(lt, 2.8, 3.6) * .5);
    if (ghost > .01) {
      const ox = 940, oy = 560;
      // 里面淡淡的暖色，别只剩线
      paint([[ox - 430, oy - 330], [ox + 430, oy - 330], [ox + 430, oy + 300], [ox - 430, oy + 300]],
        { wash: '#F3E3C4', washOp: 55, fill: PAL.sunLt, fillOp: 35, bleed: 1, ink: null });
      paint([[ox - 430, oy - 330], [ox - 130, oy - 330], [ox - 130, oy + 60], [ox - 430, oy + 60]],
        { wash: '#F9D9A4', washOp: 70, bleed: 1, ink: null });

      // 桌
      inkLine([[ox - 520, oy + 120], [ox + 520, oy + 100]], 4, PAL.ink, 'ink', 0);
      inkLine([[ox - 460, oy + 128], [ox - 460, oy + 320]], 3.4, PAL.ink, 'ink', 0);
      inkLine([[ox + 460, oy + 112], [ox + 460, oy + 310]], 3.4, PAL.ink, 'ink', 0);
      // 灯
      inkLine([[ox + 250, oy + 110], [ox + 250, oy - 120], [ox + 150, oy - 120]], 3.4, PAL.ink, 'ink', 0);
      paint([[ox + 150, oy - 120], [ox + 350, oy - 120], [ox + 330, oy - 30], [ox + 170, oy - 30]],
        { ink: PAL.ink, sw: 3, curv: .2 });
      // 窗
      inkLine([[ox - 420, oy - 220], [ox - 180, oy - 230], [ox - 180, oy + 20], [ox - 420, oy + 30], [ox - 420, oy - 220]], 3.6, PAL.ink, 'ink', 0);
      inkLine([[ox - 300, oy - 225], [ox - 300, oy + 25]], 2.6, PAL.ink, 'inkfine', 0);
      inkLine([[ox - 420, oy - 100], [ox - 180, oy - 105]], 2.6, PAL.ink, 'inkfine', 0);
      // 椅子与坐着的人
      inkLine([[ox - 60, oy + 120], [ox - 60, oy - 70], [ox + 60, oy - 70], [ox + 60, oy + 120]], 3.4, PAL.ink, 'ink', 0);
      // 只留一把椅子和桌上的纸，不画人（剪影会糊成一团黑）
    }

    const px = lerp(200, 1700, clamp(lt / dur)), py = 700 + sin(t * 1.4) * 50;
    LIB.plane(px, py, 265, -.08);
    camEnd();
  }

  // ---------------- 2. 俯冲
  function diveClimb(t, lt, dur) {
    const k = clamp(lt / dur);
    camBegin(960, 540, 1.0 + clamp(lt / dur) * .10, 0);
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#9ED3EF', washOp: 255, ink: null });
    paint(rectPts(-300, 600, W + 600, 700), { wash: '#FBEBCB', washOp: 120, bleed: 1.2, ink: null });
    LIB.sun(1560, 200, 80, t);
    for (let i = 0; i < 4; i++) LIB.cloud(200 + i * 480, 300 + (i % 2) * 240, 360, { seed: i, op: 220 });

    const u = ease(k);
    const px = lerp(260, 1660, u);
    const py = 260 + sin(k * PI) * 430;
    const rot = cos(k * PI) > 0 ? .55 : -.55;
    LIB.plane(px, py, 285, rot);

    for (let i = 0; i < 10; i++) {
      const x = px - 150 - i * 26, y = py + 30 + i * 6;
      inkLine([[x, y], [x - 90, y + 22]], 2.2, '#FFF6E2', 'dry', 0);
    }
    camEnd();
  }

  // ---------------- 3. 从黎明到夜晚
  function dayNight(t, lt, dur) {
    const k = clamp(lt / dur);
    let sky;
    if (k < .3) sky = mixCol('#F7C9A0', '#9ED3EF', k / .3);
    else if (k < .6) sky = mixCol('#9ED3EF', '#8FB4DD', (k - .3) / .3);
    else if (k < .82) sky = mixCol('#8FB4DD', '#4A4E7A', (k - .6) / .22);
    else sky = mixCol('#4A4E7A', '#242B52', (k - .82) / .18);

    camBegin(960, 540, 1.0 + k * .08, 0);
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: sky, washOp: 255, ink: null });
    paint(rectPts(-300, 700, W + 600, 600), { wash: mixCol(sky, PAL.cream, .4), washOp: 90, bleed: 1.4, ink: null });

    const a = PI * (1 - k * .95);
    if (k < .75) LIB.sun(960 - cos(a) * 900, 700 - sin(a) * 640, 80, t);
    if (k > .62) {
      const mk = (k - .62) / .38;
      LIB.moon(300 + mk * 1200, 700 - sin(mk * PI) * 560, 66);
    }
    if (k > .7) {
      for (let i = 0; i < 40; i++) {
        paint(ellPts(hash(i * 1.7) * W, hash(i * 4.9) * 700, 2.2, 2.2, 6),
          { wash: PAL.cream, washOp: 200 * ease(seg(k, .7, 1)) * (.5 + .5 * sin(t * 3 + i)), ink: null });
      }
    }

    // 远山
    const hills = [[-300, 900], [200, 800], [700, 860], [1200, 790], [1700, 850], [2200, 810], [2200, 1400], [-300, 1400]];
    paint(hills, { wash: mixCol('#7FAE5A', '#2E3A55', k * .9), washOp: 255, fill: PAL.night, fillOp: 25, ink: PAL.ink, sw: 2.2, curv: .4 });

    const px = lerp(-200, 2140, k), py = 470 - sin(k * PI * 2) * 90;
    LIB.plane(px, py, 245, -.05);
    camEnd();
  }

  // ---------------- 4. 啦啦啦
  function danceBreak(t, lt, dur) {
    camBegin(960, 560, 1.04, 0);
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#F3D9EC', washOp: 255, ink: null });
    paint([[-300, 800], [2200, 780], [2200, 1400], [-300, 1400]], { wash: '#C98FB4', washOp: 250, fill: PAL.night, fillOp: 25, ink: PAL.ink, sw: 2.4, curv: 0 });
    for (let i = 0; i < 9; i++) paint(ellPts(160 + i * 200, 800, 24, 11, 10), { wash: PAL.sunLt, washOp: 210, ink: null });

    const cols = [PAL.clay, PAL.sun, PAL.teal, PAL.violet, PAL.rose];
    for (let i = 0; i < 5; i++) {
      const x = 300 + i * 330;
      const b = pulse(t + i * .08, 4) * 40;
      push(); translate(x, 806 - b); rotate(sin(t * 4 + i) * .16); scale(1.22);
      // 身体
      paint(rrPts(-52, -170 - b * .4, 104, 170 + b * .4, 32, 4),
        { wash: cols[i], washOp: 250, fill: PAL.night, fillOp: 25, ink: PAL.ink, sw: 2.4, curv: .5 });
      // 眼睛与嘴
      for (const sd of [-1, 1]) paint(ellPts(sd * 22, -118, 8, 11, 8), { wash: PAL.ink, ink: null });
      inkLine([[-18, -92], [0, -78], [18, -92]], 2.6, PAL.ink, 'ink', .6);
      // 举手的胳膊
      inkLine([[-52, -148], [-96, -196 - b * .6]], 5, PAL.ink, 'ink', .4);
      inkLine([[52, -148], [96, -196 - b * .6]], 5, PAL.ink, 'ink', .4);
      // 腿
      inkLine([[-22, 0], [-34, 60]], 5, PAL.ink, 'ink', 0);
      inkLine([[22, 0], [34, 60]], 5, PAL.ink, 'ink', 0);
      pop();
    }

    for (let i = 0; i < 26; i++) {
      const ph = frac(t * .6 + i * .21);
      paint(ellPts(100 + hash(i * 3.3) * 1750, ph * 900, 9, 5, 8, 0, t * 2 + i),
        { wash: [PAL.clay, PAL.sun, PAL.teal, PAL.violet][i % 4], washOp: 210, ink: null });
    }
    camEnd();
  }

  chapter('dream', 47.983, 58.928, [[47.983, dreamOutline], [52.237, diveClimb], [54.445, dayNight], [57.236, danceBreak]]);
})();
