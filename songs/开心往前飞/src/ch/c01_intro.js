// c01_intro.js — 0 – 6.637：纸上的一架飞机，画完就飞走了。
(() => {
  // ---------------- 1. 标题
  function opening(t, lt, dur) {
    // 背后一圈暖光
    const k = ease(seg(lt, 0, 1.2));
    camBegin(960, 470, 1.0 + k * .05, 0);
    paint(ellPts(960, 470, 780 * k, 340 * k, 28), { fill: PAL.sun, fillOp: 70, bleed: 1.2, ink: null });
    paint(ellPts(960, 470, 520 * k, 210 * k, 24), { fill: PAL.clayLt, fillOp: 45, bleed: 1.2, ink: null });

    // 标题：手写体（中文会回退到系统黑体）
    letter('开心往前飞', 960, 440, 150, PAL.clay, {
      font: '150px "Permanent Marker", "Noto Sans CJK SC", sans-serif',
      pop: seg(lt, .15, .6), rot: -.03,
    });
    letter('一段纸上的旅行', 960, 640, 44, PAL.ink, {
      font: '44px "Shantell Sans", "Noto Sans CJK SC", sans-serif',
      pop: seg(lt, .7, 1.2), rot: -.01,
    });

    camEnd();
    // 标题下面那一小架飞机，跟着拍子飘
    push();
    translate(960, 830 + sin(t * 2) * 10);
    rotate(-.12 + sin(t * 1.3) * .05);
    paint([[130, 0], [-70, -80], [-20, 0], [-70, 80]], { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: 1.6 });
    inkLine([[130, 0], [-20, 0]], 1.2, PAL.ink, 'inkfine', 0);
    pop();
  }

  // ---------------- 2. 铅笔把它画出来，然后它走了
  function liftOff(t, lt, dur) {
    const zoom = 1.28 - ease(seg(lt, 0, dur)) * .10;
    camBegin(960, 540, zoom, -.008);

    // 一张纸铺满画面
    paint(rectPts(-120, -120, W + 240, H + 240), { wash: PAL.paper, washOp: 255, ink: null });
    paint(ellPts(1480, 180, 700, 500, 24), { fill: PAL.sun, fillOp: 40, bleed: 1.4, ink: null });

    // 铅笔一笔一笔画出机翼
    const draw = ease(seg(lt, .12, .95));
    const A = [1180, 520], B = [700, 340], C = [880, 520], D = [700, 700];
    const path = [A, B, C, D, A];
    const upto = Math.max(2, Math.floor(draw * (path.length - 1) + 1));

    // 飞机立起来之后，纸上那圈线要淡掉，不然会叠成两架
    const fly = ease(seg(lt, .95, 2.4));
    const inkNow = mixCol(PAL.ink, PAL.paper, min(1, fly * 2.4));
    inkLine(path.slice(0, upto), 3.2, inkNow, 'ink', .1);
    if (draw > .7) inkLine([A, C], 1.8, mixCol(PAL.ink, PAL.paper, min(1, fly * 2.4)), 'inkfine', 0);

    if (fly > .12) {
      const px = lerp(1040, 1580, fly), py = lerp(470, 170, fly);
      const s = lerp(200, 340, fly), rot = lerp(0, -.55, fly);
      push();
      translate(px, py); rotate(rot);
      paint([[s * .5, 0], [-s * .34, -s * .32], [-s * .1, 0], [-s * .28, -s * .12]], {
        wash: PAL.cream, washOp: 255, fill: PAL.cream, fillOp: 60, ink: PAL.ink, sw: 2.2,
      });
      paint([[s * .5, 0], [-s * .1, 0], [-s * .28, s * .12], [-s * .34, s * .32]], {
        wash: PAL.clayLt, washOp: 210, fill: PAL.clayLt, fillOp: 50, ink: PAL.ink, sw: 2.0,
      });
      pop();
    }

    // 收尾闪白，接下一场
    flash(easeIn(seg(lt, 2.1, dur)) * .8);
    camEnd();
  }

  chapter('intro', 0, 6.637, [[0, opening], [2.2, liftOff]]);
})();
