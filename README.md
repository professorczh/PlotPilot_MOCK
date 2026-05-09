# Plot Pilot - Mock

**Plot Pilot - Mock** 是一款专注于前端美学 UI 交互快速验证的 MVP 系统。它融合了传统美学与现代 HUD 交互设计，主要用于展示沉浸式创作平台的视觉表现与智能交互流程。

## 🎨 设计哲学：三重意境 (Triple Aesthetics)

本项目支持三套完整的色彩体系，通过 `AGENTS.md` 规范严格控制：

- **墨 (Ink - Dark Mode)**: 深炭黑背景 (`#0F0F0F`)，模拟中国水墨与深邃夜空，专注于高强度沉浸感。
- **纸 (Paper - Warm Light)**: 温暖的手工宣纸背景 (`#ece9e0`)，针对长文阅读优化，温润而不刺眼。
- **砚 (Modern - Cool Light)**: 现代冷灰色背景 (`#f5f5f5`)，瑞士极简主义风格，专业且精准。

### 品牌标识与排版 (Typography)
- **品牌/Logo**: `Ma Shan Zheng` (马善政毛笔体)。**注：仅用于品牌标识，非请勿用。**
- **标题/标签**: `Oswald` (工业感大写)。
- **正文/阅读**: `Noto Serif SC` (思源宋体)。**注：仅用于特定阅读场景。**
- **UI/通用**: `Inter`。
- **技术数据**: `JetBrains Mono`。

## 🚀 核心功能与组件

- **智能图片加载 (HudImage)**: 内置扫光 (Shimmer) 动画与自动占位符，解决大图加载时的视觉跳变。
- **新书设置向导 (Onboarding)**:
  - **核心博弈实体映射**: 人物关系的动态构建。
  - **核心逻辑节点同步**: 地理位置的智能测绘。
- **全能创作工作台**:
  - **沉浸式编辑器**: 专为长文创作优化的排版。
  - **控制台监控 (Three-Stage Analytics)**: 支持展开、吸附、坍缩三重状态切换。

## 💡 技术说明 (Project Scope)

- **前端优先**: 本项目主要用于 **美学 UI 交互的快速 MVP 验证**，不包含复杂的后端持久化与服务端推演逻辑。
- **交互性能**: 严格遵循 Framer Motion 的 Out-Quart 缓动曲线，确保 HUD 特效在大批量数据下依旧丝滑。

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
