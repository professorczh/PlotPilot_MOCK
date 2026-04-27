# 墨枢 (Plot Pilot) - AI 创作领航系统

![Plot Pilot Banner](https://picsum.photos/seed/ink/1200/400?blur=2)

**墨枢 (Plot Pilot)** 是一款专为小说作者设计的 AI 辅助创作系统。它融合了传统水墨美学与现代 HUD 交互设计，旨在通过深度推演引擎，协助作者完成从世界观构建到情节弧线设计的全流程创作。

## 🎨 设计哲学：玄墨与朱砂 (Ink & Tech)

本项目采用独特的 **“玄墨” (Ink Black)** 与 **“朱砂” (Cinnabar Red)** 视觉体系，追求一种“科技古风”的平衡感。

- **色彩体系**: 
  - 背景: `#0F0F0F` (深炭黑)
  - 面板: `#171717` (炭灰)
  - 强调: `#DC2626` (朱砂红)
- **排版基因**:
  - 品牌/Logo: `Ma Shan Zheng` (马善政毛笔体)
  - 标题/标签: `Oswald` (工业感大写)
  - 正文/阅读: `Noto Serif SC` (思源宋体)
  - UI/交互: `Inter`
- **交互动效**: 基于 Framer Motion 的 Out-Quart (`[0.23, 1, 0.32, 1]`) 平滑曲线，模拟墨迹扩散与呼吸感。

## 🚀 核心功能

- **多 API 配置面板**: 支持 Gemini, OpenAI, Anthropic, DeepSeek 等主流 AI 供应商，支持自定义 Base URL 与模型 ID。
- **新书设置向导 (Onboarding)**:
  - **世界观构建**: 自动推演力量体系、地理生态与社会结构。
  - **角色生成**: 深度生成人物小传、性格缺陷与动机。
  - **智能测绘**: 自动生成地点关联图谱。
- **全能创作工作台**:
  - **沉浸式编辑器**: 专为长文创作优化的排版。
  - **AI 助手面板**: 实时情节建议、润色与续写。
  - **控制台监控 (Three-Stage Analytics)**:
    - **展开模式**: 全景 D3 动态图表展示。
    - **已折叠 (Header Mode)**: 磁吸吸附至标题栏，保留实时监控状态。
    - **全折叠 (Zero Mode)**: 坍缩至零高度并保留底部隔离线，实现 100% 沉浸编辑。

## 💡 开发避坑指南 (Interaction Lessons)

在构建本项目的复杂物理布局时，我们针对 `react-resizable-panels` (v4.10.x) 沉淀了以下关键经验：

1. **非标准 Ref 陷阱**: 该版本库不使用标准 `ref`，必须使用 `groupRef` 和 `panelRef`。若使用标准 `ref`，Ref 永远为 `null` 且不报错。
2. **单位识别悖论**: 
   - **数字 (Number)**: 库将其识别为物理像素 (Pixels)。
   - **字符串 (String)**: 库将其识别为容器百分比 (Percentage)。
   - *经验*: 比例布局务必使用字符串格式，如 `maxSize="100"`。
3. **物理结构完整性**: `Panel` 与 `Separator` 必须是 `Group` 的直接子元素。严禁使用 `React.Fragment` 或中间容器包裹，否则会导致物理引擎索引失效，Ref 绑定断裂。
4. **渲染性能锁死**: 禁止在组件 Render Body 中直接对 Ref 进行属性读取（如 `ref.current.getSize()`），这会干扰物理引擎的坐标计算。
5. **动态磁吸计算**: 通过 `getHeaderPercentage` 实现像素到百分比的实时映射，使面板能精准吸附在 Header 边缘而不产生位移扭曲。

## 🛠 技术栈

- **框架**: React 19 + Vite
- **样式**: Tailwind CSS 4.0
- **动画**: Framer Motion
- **图标**: Lucide React
- **布局**: React Resizable Panels
- **图表**: Recharts & D3.js

## 📦 快速开始

1. **安装依赖**:
   ```bash
   npm install
   ```

2. **启动开发服务器**:
   ```bash
   npm run dev
   ```

3. **配置 API**:
   点击首页或编辑器右上角的 **设置 (Settings)** 图标，配置您的 AI 供应商 API Key。

## 📝 开发规范

- **字体限制**: 书法字体 (`font-brush`) 仅限用于 Logo 和作品库标题，其余 UI 统一使用 `font-display` 或 `font-sans`。
- **性能优化**: 背景光晕动效建议使用 `will-change` 优化，大面积模糊滤镜需注意高分屏下的渲染压力。

---

© 2026 PLOT PILOT | 墨枢 - 为创作者而生
