// c01_start.js — 第一镜的起点。把这里画的所有东西换掉，就是你的 MV 的第一个镜头。
// 规则：镜头函数 fn(t, lt, dur) 必须是 t 的纯函数——不能有跨帧状态，不能用 Math.random()。
(() => {
  function opening(t, lt, dur) {
    // 背景：一张纸 + 放射光
    paint(rectPts(-200, -200, W + 400, H + 400), { wash: PAL.paper, washOp: 255, ink: null });
    sunburst(960, 470, 900, 900, t * 0.04, 18, 2200, 70);

    // 主角：跟着拍子轻轻起伏
    const bob = pulse(t, 5) * 12;
    clawd(960, 880 - bob, 30, { mouth: 'smile', aL: 0.3, aR: 0.3 });

    // 标题手写字
    letter('歌名', 960, 250, 120, PAL.clay, {
      font: '120px "Permanent Marker", "Noto Sans CJK SC", sans-serif',
      rot: -0.02,
    });
  }

  // 0 → 这首歌的时长（秒）。这里的数字要和 song.config.json 的 duration 一致。
  chapter('start', 0, 156.6, [[0, opening]]);
})();
