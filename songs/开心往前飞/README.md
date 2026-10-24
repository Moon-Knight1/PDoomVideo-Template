# 模板：一首歌 = 一个目录

复制这个目录，就得到一支新 MV 的工程：

```bash
cd songs
cp -r _template my-song        # 目录名建议用 `<歌手>-<歌名>` 或英文短名
cd my-song
```

## 一个目录里有什么

```
my-song/
├── song.config.json   ← 先改这里：歌名、音频路径、时长
├── assets/            ← 把你的 mp3 放进来
├── src/
│   ├── core.js …      ← 引擎（从主仓库复制，一般不用动）
│   ├── lyrics.js      ← 歌词时间轴，换歌就整张替换
│   └── ch/            ← 章节：一个镜头/一段落在文件里
├── studio.html        ← 加载顺序表：加章节要在这里加一行
├── render.mjs         ← 渲染器（读 song.config.json）
├── STORYBOARD.md      ← 分镜表，先填它
└── out/               ← 渲染产物（已忽略，可随时删）
```

## 开工四步

```bash
# 1. 放歌、改配置
cp ~/音乐/xxx.mp3 assets/song.mp3
#    然后编辑 song.config.json：title / audio / duration

# 2. 抽帧看效果（改一次看一次，别渲整片）
node render.mjs --sheet=2,8,20 --cols=3 --w=640 --out=out/check.jpg

# 3. 全片
node render.mjs --frames=0:时长 --workers=4

# 4. 编码
node render.mjs --encode
```

## 加一个章节

1. 复制 `src/ch/c01_start.js` 成 `c02_xxx.js`，改里面的绘制与 `chapter(...)`。
2. 在 `studio.html` 里加一行 `<script src="src/ch/c02_xxx.js"></script>`。
3. 章节时间要**首尾相接**，否则会掉进占位画面。

## 铁律

- 镜头函数 `fn(t, lt, dur)` 必须是 `t` 的纯函数：无跨帧状态、无 `Math.random()`。
- 四个数字要对齐：`song.config.json` 的 `duration`、`chapter(...)` 的结束秒、`studio.html` 滑块的 `max`、`--frames=0:时长`。
