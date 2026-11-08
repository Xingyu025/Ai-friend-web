# 屏幕里的“搭子”

纯静态站点，无框架、无包管理配置、无构建步骤。解压后保持完整目录；`index.html` 是入口。适配电脑 1366×768 至 1920×1080。

## 文件结构

```text
.
├── index.html                 十二屏结构、原有论述和内联样式
├── .nojekyll                  GitHub Pages 静态资源标记
├── image-fallback-sw.js       四张可选插图的缺图回退
├── img/                       按约定放入实际插图
├── data/data.js               真实问卷数据、逐字原话、手工关键词
├── js/
│   ├── echarts.min.js         原有本地 ECharts
│   └── app.js                 统计计算、图表、翻页、词云联动
├── fonts/
│   ├── song/                  Noto Serif SC 400/600 分片及 OFL.txt
│   └── kai/                   LXGW WenKai Regular 分片及 OFL.txt
├── AGENTS.md                  仓库工作规则
└── docs/
    ├── TASK.md                本次需求与原始统计
    ├── COPY.md                小组文字填写模板
    └── PROMPTS.md             原有协作提示
```

所有脚本和字体使用本地相对路径，不依赖 CDN。字体 CSS 保留 unicode-range，浏览器只下载当前文字需要的分片。正文和标题分别使用宋体 400/600，原话使用文楷 Regular；黑体使用系统字体栈。
字体来源：`@fontsource/noto-serif-sc` 5.3.1、`lxgw-wenkai-webfont` 1.7.0，许可证随字体放在相应目录。

## 本地查看

直接双击根目录 `index.html`，或在仓库根目录运行：

```sh
python3 -m http.server 8000
```

然后访问 `http://localhost:8000/`。不要只复制 HTML，应同时保留 data、js 和 fonts。

本次已用 Chromium/Playwright 对两种分辨率逐屏截图，24张截图均未发现屏幕越界；本地 HTTP 预览无控制台错误、无外部资源请求。云环境浏览器策略以 `ERR_BLOCKED_BY_ADMINISTRATOR` 拒绝 `file://` 导航，因此本次没有实测双击离线打开，发布前请在普通电脑上补做这一项。

## 修改问卷数据

以 `docs/TASK.md` 第4、5节为准，编辑 `data/data.js` 的 `window.SURVEY`：

- `meta.total` 是总样本数，`period`、`scope` 仍待小组填写，`isSample` 保持 `false`。
- 每题 `n` 是实际作答人数；`options` 与 `counts` 一一对应，不要单独重排其中一个数组。
- 第6–11题 n=21，第12题 n=2，第14题为做法多选，第15题为填空选填。
- 第10题只有 `items[].mean`，不可反推或虚构各分值人数分布。
- `q15.answers` 必须保留原话的大小写、空格、标点。`keywords` 包含 `word`、`matches`、`theme`、`side`、`size`、`ids`；`ids` 指向原话，`matches` 用于逐字高亮。新增或更换关键词时应同时核对这两项。
- 人数、分母、百分比、图注作答人数、年级构成与主题条数均由 `js/app.js` 计算；百分比四舍五入取整。图注自动按出现顺序从图1编号到图12。

## 网页文字状态

已按小组上传的 `docs/COPY.md` 填入作品标题、副标题、署名、首尾聊天、引导语、结论与调查平台。

- 标为“无”的条目已按小组确认删除，网页当前没有 `【……】` 占位。
- 原著与报告的已有名称保留；未提供的版本页码和链接没有补写。
- 第4屏、第6屏的两条可选批注已删除；问卷原始回答和词云引用保留。
- 结尾保留第十一条题记；聊天改为“我—朋友—我”三条消息。
- 回收时间、发放范围、访谈、分工及插图工具等未提供内容不再展示；问卷统计数据未改。
- 第6屏“质量互变”、第10屏“坚持两点论和重点论相统一”及导航标签已按最新文字稿更新。

后续编辑文字请同步修改 `docs/COPY.md`，并重新检查1366×768下的逐屏显示。

## 可选插图

将 `docs/IMAGES.md` 约定的四张 WebP 放入 `img/`，通过本地 HTTP 服务或 GitHub Pages 访问后刷新即可显示。
请保留根目录 `image-fallback-sw.js`：它仅为四张可选插图提供缺图回退，不缓存或处理其他资源。直接双击 `file://` 时展示完整无图版。

## 开启 GitHub Pages

1. 将完整目录内容上传到 GitHub 仓库根目录，确保根目录能看到 `index.html` 与 `.nojekyll`。
2. 打开仓库 **Settings → Pages → Build and deployment**。
3. **Source** 选择 **Deploy from a branch**。
4. **Branch** 选择 `main`，文件夹选择 `/ (root)`，保存。
5. 等待几分钟，通过 `https://<用户名>.github.io/<仓库名>/` 访问。

无需填写域名、安装依赖或运行构建。本次只准备发布结构，没有向任何远程仓库推送或执行线上发布。

## 翻页和词云操作

| 操作 | 功能 |
| --- | --- |
| ↓ / PageDown / 空格 | 下一屏 |
| ↑ / PageUp / Shift+空格 | 上一屏 |
| Home / End | 第一屏 / 最后一屏 |
| 右侧12个圆点 | 跳到对应屏幕 |
| 扉页四层目录 | 跳到现象、本质、矛盾、主体 |
| 点击词云关键词 / Tab后按Enter或空格 | 显示对应原话，突出同主题词 |

原话面板支持独立滚动，键盘焦点在面板内时保留原生滚动，不触发整页翻页。其余屏幕没有内部滚动区域。
图表在首次进入屏幕时生长，关系图依次画线且只播放一次；系统启用“减少动态效果”时直接显示最终状态。
