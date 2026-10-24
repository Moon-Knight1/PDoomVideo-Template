// c09_home.js — 67.472 – 77.0：天亮，飞机落回桌上，人醒了。
(() => {
  // ---------------- 房间（黎明）
  function room(t, k) {
    const wall = mixCol('#4A4168', '#8C7C86', k);
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: wall, washOp: 255, ink: null });

    // 窗与朝阳
    const wx = 120, wy = 96, ww = 450, wh = 500;
    paint(rectPts(wx - 20, wy - 20, ww + 40, wh + 40), { wash: '#6B5A6E', washOp: 255, ink: PAL.ink, sw: 2.2 });
    paint(rectPts(wx, wy, ww, wh), { wash: mixCol('#2A3158', '#F6C48A', k), washOp: 255, ink: null });
    paint(rectPts(wx, wy + wh * .6, ww, wh * .4), { wash: '#F08A5A', washOp: 60 + 40 * k, bleed: 1, ink: null });
    paint(ellPts(wx + ww * .5, wy + wh * .8 - k * 110, 46 + k * 16, 46 + k * 16, 20),
      { wash: '#FFD98C', washOp: 240, fill: '#FFF0C4', fillOp: 110, bleed: .4, ink: null });
    inkLine([[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], 4.4, PAL.ink, 'ink', 0);
    inkLine([[wx, wy + wh * .46], [wx + ww, wy + wh * .46]], 4.4, PAL.ink, 'ink', 0);
    paint(rectPts(wx - 30, wy + wh + 6, ww + 60, 28, 2), { wash: '#8B7588', washOp: 255, ink: PAL.ink, sw: 1.6 });

    // 桌面（前挡板在人物之后单独画，好让他"坐"在桌后）
    paint(rectPts(-300, 700, W + 600, 210), { wash: '#C08A57', washOp: 255, fill: PAL.sandDk, fillOp: 45, ink: PAL.ink, sw: 2.4 });
    inkLine([[-300, 700], [W + 300, 690]], 3, '#D6A06A', 'ink', 0);

    // 桌面上的投影：只给纸一片很淡的，人那块由桌沿挡住
    LIB.shadow(1080, 866, 360, 16, 22);
    // 桌上那张纸
    paint([[700, 720], [1440, 706], [1466, 862], [724, 878]], { wash: PAL.cream, washOp: 250, fill: PAL.ink, fillOp: 12, ink: PAL.ink, sw: 2 });

    // 台灯（关着）
    paint(rrPts(1474, 300, 190, 74, 24, 2), { wash: '#D8B77E', washOp: 255, ink: PAL.ink, sw: 2.2, curv: .3 });
    paint([[1448, 372], [1520, 372], [1548, 436], [1420, 436]], { wash: '#E8D2A8', washOp: 255, ink: PAL.ink, sw: 1.6, curv: .3 });
    paint(rectPts(1544, 436, 18, 250, 1), { wash: '#C9882A', washOp: 255, ink: PAL.ink, sw: 1.6 });
    paint(ellPts(1553, 690, 88, 20, 16), { wash: '#B87A2C', washOp: 255, ink: PAL.ink, sw: 1.6 });
  }

  function deskFront() {
    paint(rectPts(-300, 880, W + 600, 440), { wash: '#8A5836', washOp: 255, fill: '#5E3A22', fillOp: 60, ink: null });
    inkLine([[-300, 883], [W + 300, 873]], 3.6, '#6E4226', 'ink', 0);
  }

  // ---------------- 1. 飞机回家
  function home(t, lt, dur) {
    const k = clamp(lt / dur);
    room(t, .28 + .72 * ease(seg(lt, 0, 2.2)));

    // 睡着的人
    researcher(720, 1006, 40, { sit: true, eyes: 'closed', mouth: 'flat', rot: .18, aL: -1.15, aR: -1.15, coat: '#FBF4E6' });
    deskFront();
    for (let i = 0; i < 3; i++) {
      const ph = frac(t * .35 + i * .33);
      letter('z', 630 + ph * 50, 700 - ph * 110, 22 + ph * 20, PAL.ink, { alpha: (1 - ph) * .6, rot: .2 });
    }

    // 飞机从窗那边滑回来，落在纸上
    const f = easeOut(seg(lt, .2, 2.4));
    const px = lerp(300, 1080, f), py = lerp(260, 790, f) - sin(f * PI) * 80;
    LIB.plane(px + sin(t * 2) * 6, py, lerp(200, 150, f), lerp(-.5, -.05, f));

    // 晨光柱
    for (let i = 0; i < 4; i++) {
      paint([[120 + i * 80, 96], [250 + i * 80, 96], [700 + i * 150, 900], [430 + i * 150, 900]],
        { fill: '#FFE9B8', fillOp: 18 + 8 * ease(seg(lt, .4, 2)), bleed: 1.4, ink: null });
    }
  }

  // ---------------- 2. 醒
  function awake(t, lt, dur) {
    room(t, 1);
    const wake = ease(seg(lt, 0, .7));
    researcher(720, 1006, 40, {
      sit: true,
      eyes: wake > .5 ? 'wide' : 'closed',
      mouth: wake > .5 ? 'o' : 'flat',
      rot: lerp(.16, .02, wake),
      aL: lerp(-1.3, -1.1, wake),
      aR: lerp(-1.3, -.7, wake),
      coat: '#FBF4E6',
    });
    deskFront();

    // 纸上的飞机，然后起飞到他手里
    const lift = easeIn(seg(lt, .8, 2.1));
    const px = lerp(1080, 880, lift), py = lerp(790, 700, lift);
    LIB.plane(px, py, lerp(150, 240, lift), lerp(-.05, -.3, lift));

    for (let i = 0; i < 8; i++) {
      const a = i / 8 * TAU + t;
      paint(starPts(px + cos(a) * 150, py + sin(a) * 100, 8 + 4 * sin(t * 3 + i), .3, 4, 0),
        { wash: PAL.sunLt, washOp: 190, ink: null });
    }
  }

  // ---------------- 3. 片尾
  function endCard(t, lt, dur) {
    room(t, 1);
    const k = ease(seg(lt, .2, 1.6));
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: PAL.paper, washOp: 255 * k, ink: null });
    paint(ellPts(960, 460, 700 * k, 330 * k, 28), { fill: PAL.sun, fillOp: 70 * k, bleed: 1.4, ink: null });
    paint(ellPts(960, 460, 460 * k, 200 * k, 24), { fill: PAL.clayLt, fillOp: 40 * k, bleed: 1.4, ink: null });

    letter('开心往前飞', 960, 440, 140, PAL.clay, {
      font: '140px "Permanent Marker", "Noto Sans CJK SC", sans-serif',
      alpha: seg(lt, .5, 1.4), rot: -.03,
    });
    letter('一段纸上的旅行', 960, 600, 42, PAL.ink, { alpha: seg(lt, .9, 1.7) * .8 });
    letter('— 完 —', 960, 750, 36, PAL.ink, { alpha: seg(lt, 1.6, 2.3) * .7 });

    // 最后一架小飞机飞向远处
    LIB.plane(lerp(420, 1520, easeIn(seg(lt, 1.6, 4.2))), 880 - seg(lt, 1.6, 4.2) * 110, 95, -.14);
  }

  chapter('home', 67.472, 77.0, [[67.472, home], [71.0, awake], [73.6, endCard]]);
})();
