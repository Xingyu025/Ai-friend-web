# 插图生成方案

共4张图，分别用在开头、原理、主体、结尾这四屏。数据密集的屏不放图，靠"两种光"和章节大字来增加层次。

## 一、画什么：怎么决定的

每张图都要回答"它在叙事里是哪一刻"，而不是单纯装饰。决定内容时用了三条线索：

1. **作品里的三个符号**
   - 手机屏幕的青光 = AI；
   - 台灯和阳光的琥珀光 = 人；
   - 一本旧书 = 经典（马克思）。画书，不画马克思本人的肖像。
2. **同一个场景的时间推移**：同一张宿舍书桌，从深夜（只有手机亮着、书合着）到清晨（手机扣在桌上、书翻开、阳光照进来），再到白天（人走出宿舍、和朋友在一起）。四张图连起来，就是作品"从深夜找AI，到白天走向真人"的主线。
3. **原理那一屏**：用"一扇扇亮着灯的宿舍窗户"表现"社会关系的总和"。每扇窗里都是一个人和他的关系，整栋楼像一张网。

## 二、风格：木刻版画

推荐用**木刻版画**风格，理由有三：

- 它和马克思主义思想在中国的传播有真实的联系。1931年鲁迅在上海举办木刻讲习会，推动了"新兴木刻运动"，木刻成为左翼文艺的代表形式。
- 刻刀线条粗犷、明暗强烈，有文化感，又不像宣传海报那样政治化。
- 用这种语言画当代大学生的日常（宿舍、手机、台灯），本身就是"用马克思主义的眼光看日常生活"。

深夜的图用黑底白线（像反刻），白天的图用白底墨线，再加少量琥珀色和青色。

如果试出来觉得太沉重，可以换成**铜版画或钢笔素描加淡彩**：线条更细，气质更安静。四张图要用同一种风格。

> 上面关于新兴木刻运动的史实，如果要写进网页或讲解，请先对照资料核对。

## 三、提示词

### 通用风格（每张图都加上）

中文（即梦、豆包、通义万相、可灵等）：

```
木刻版画风格，粗犷有力的刻刀线条，强烈的明暗对比，大面积深墨蓝色暗部；画面只有两种光源：手机屏幕的冷青色光、台灯或阳光的暖琥珀色光；构图简洁安静，留出大面积空白区域；画面中没有任何文字；人物只出现背影、剪影或手部，看不清面孔；16:9横幅
```

英文（Midjourney 等）：

```
woodcut print, bold gouge marks, strong chiaroscuro, large areas of deep ink-blue shadow, only two light sources: cold cyan glow from a phone screen and warm amber light from a lamp or sunlight, quiet minimal composition with generous empty space, no text, figures seen only from behind or in silhouette, no faces --ar 16:9 --style raw
```

### 反向提示词（工具支持时填写）

```
文字，水印，logo，清晰的人脸，马克思肖像，红旗，五角星，标语，霓虹灯，赛博朋克，卡通，动漫，3D渲染，照片写实，过多细节
```

### 1. `01-night`　开头：深夜

```
深夜的大学宿舍书桌，房间里只有一部手机亮着，冷青色的屏幕光照亮一只握着手机的手和半张桌面；桌角放着一本合上的旧书和一盏关着的台灯；窗外是夜色和远处零星的灯光。主体位于画面右侧三分之一，左侧三分之二是深色暗部，大面积留空。黑底白线的木刻效果。
```

```
late night, a university dorm desk, the only light is a phone screen casting cold cyan light on one hand and half the desk, a closed old book and a switched-off desk lamp in the corner, night window with a few distant lights, subject in the right third, left two thirds dark and empty, white-line woodcut on black
```

### 2. `02-windows`　原理：一扇扇亮着的窗

```
夜晚的宿舍楼正面，平视角度，一扇扇窗户整齐排列，大多数亮着暖琥珀色的灯光，有几扇窗里能看到两三个人的剪影在交谈，只有一扇窗透出冷青色的屏幕光；整栋楼像一张由窗户组成的网。构图对称、安静，整体偏暗。黑底白线的木刻效果。
```

```
night, front view of a dormitory building, rows of windows like a grid, most glowing warm amber, a few windows show silhouettes of two or three people talking, a single window glows cold cyan from a screen, the building reads like a network of windows, symmetrical quiet composition, overall dark, white-line woodcut on black
```

### 3. `03-dawn`　主体：清晨

```
清晨，同一张宿舍书桌，窗帘拉开，暖琥珀色的晨光从右上方的窗户斜照进来；手机屏幕朝下扣在桌上，那本旧书翻开着，旁边一杯水；光线在桌面上投下长长的窗格影子。主体位于画面右侧和上方，左侧是浅色大面积留空。白底墨线的木刻效果，少量琥珀色。
```

```
early morning, the same dorm desk, curtains open, warm amber sunlight slanting in from a window at the upper right, the phone lies face down on the desk, the old book is open, a glass of water beside it, long window-frame shadows across the desk, subject on the right and top, left side light and empty, black-line woodcut on off-white paper with touches of amber
```

### 4. `04-together`　结尾：一起走

```
白天的校园，三个年轻人并肩走在林荫道上，只看到背影，阳光从前方照来，影子拉得很长，树影斑驳。人物位于画面下方三分之一，上方是大面积浅色的天空和树冠留白。白底墨线的木刻效果，暖琥珀色为主，少量冷青色阴影。
```

```
daytime campus, three young people walking side by side down a tree-lined path, seen only from behind, sunlight ahead, long shadows, dappled tree shade, figures in the lower third, large light empty sky and canopy above, black-line woodcut on off-white paper, mostly warm amber with a little cool cyan in the shadows
```

## 四、让四张图风格统一

1. 先生成第1张，挑出最满意的一张。
2. 生成第2到4张时，把第1张作为**风格参考图**（垫图）上传，参考强度调到中等。如果工具支持固定种子（seed），四张图用同一个种子。
3. 每张多生成几轮，挑选标准：
   - 预留文字的那一侧够空、够暗（或够亮）；
   - 没有出现文字、清晰人脸和政治符号；
   - 和其他几张放在一起，看起来像同一套作品。

## 五、导出和放置

- 尺寸 2560×1440（至少 1920×1080），横版 16:9。
- 转成 WebP 格式，质量 75 左右，每张不超过 400KB。可以用 squoosh.app 在线转换。
- 文件名必须是 `01-night.webp`、`02-windows.webp`、`03-dawn.webp`、`04-together.webp`，放进仓库根目录的 `img/` 文件夹。放进去后页面会自动显示，不需要改代码。
- 在 `docs/COPY.md` 的第12屏部分补一项"插图使用的AI工具名称"，页面上的说明会写"插图由某工具生成，提示词由小组撰写"。
