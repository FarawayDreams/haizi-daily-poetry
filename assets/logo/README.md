# 海子诗歌网站 Logo 资源清单

## 📁 文件结构

```
assets/logo/
├── README.md                    # 本文档
├── logo-main.svg               # 主要logo (SVG)
├── logo-icon.svg               # 简化图标 (SVG)
├── logo-horizontal.svg         # 横向版本 (SVG)
├── logo-dark.svg               # 深色背景版本 (SVG)
├── logo-social.svg             # 社交媒体版本 (SVG)
├── logo-16x16.png              # 16x16 图标
├── logo-32x32.png              # 32x32 图标
├── logo-64x64.png              # 64x64 图标
├── logo-128x128.png            # 128x128 图标
├── logo-256x256.png            # 256x256 图标
├── logo-horizontal.png         # 横向版本 (PNG)
├── logo-social.png             # 社交媒体版本 (PNG)
├── logo-dark.png               # 深色背景版本 (PNG)
└── favicon.ico                 # 网站图标
```

## 🎨 Logo 设计概念

### 核心元素
- **太阳** ☀️ - 象征海子诗歌中的光明与希望
- **麦穗** 🌾 - 体现对大地和农业的眷恋  
- **书页** 📖 - 代表诗歌创作和文学传承

### 设计理念
基于海子诗歌"面朝大海，春暖花开"的诗意境界，将诗歌的文学美感与自然元素完美结合。

## 📐 使用规格

### 1. 主要Logo (logo-main.svg)
- **尺寸**: 200×120px
- **用途**: 网站主页、关于页面、完整品牌展示
- **特点**: 包含太阳、麦穗、书页、文字等完整元素

### 2. 简化图标 (logo-icon.svg)
- **尺寸**: 64×64px
- **用途**: Favicon、小尺寸显示、移动端图标
- **特点**: 仅保留太阳和麦穗核心元素

### 3. 横向版本 (logo-horizontal.svg)
- **尺寸**: 300×60px
- **用途**: 网站导航栏、页面头部、横幅
- **特点**: 图标和文字横向排列

### 4. 深色背景版本 (logo-dark.svg)
- **尺寸**: 200×120px
- **用途**: 深色主题、夜间模式
- **特点**: 针对深色背景优化的颜色方案

### 5. 社交媒体版本 (logo-social.svg)
- **尺寸**: 400×400px (正方形)
- **用途**: 社交媒体头像、分享图片
- **特点**: 正方形布局，适合社交平台

## 🎯 应用场景

### 网站应用
```html
<!-- 主要Logo -->
<img src="assets/logo/logo-main.svg" alt="海子诗歌" class="main-logo">

<!-- 导航栏Logo -->
<img src="assets/logo/logo-horizontal.svg" alt="海子诗歌" class="header-logo">

<!-- Favicon -->
<link rel="icon" href="assets/logo/favicon.ico" type="image/x-icon">
```

### CSS集成
```css
.main-logo {
  width: 200px;
  height: 120px;
}

.header-logo {
  width: 300px;
  height: 60px;
}

.icon-logo {
  width: 64px;
  height: 64px;
}

/* 深色主题 */
@media (prefers-color-scheme: dark) {
  .main-logo {
    content: url('assets/logo/logo-dark.svg');
  }
}
```

## 🌈 配色方案

### 经典配色 (默认)
- **太阳**: 温暖金黄 (#B8860B → #FFD700)
- **麦穗**: 成熟麦色 (#CD853F → #DEB887)
- **书页**: 纸张白色 (#F5F5DC → #FFFFF0)
- **文字**: 深棕色 (#2F1B14)

### 深色背景配色
- **太阳**: 明亮金黄 (#FFD700 → #FFA500)
- **麦穗**: 浅金色 (#F0E68C → #DAA520)
- **书页**: 淡黄色 (#FFFACD → #F5F5DC)
- **文字**: 浅色 (#F5F5DC)

## 📱 响应式使用指南

### 桌面端 (≥1024px)
- 使用 `logo-main.svg` 或 `logo-horizontal.svg`
- 推荐尺寸: 200×120px 或 300×60px

### 平板端 (768px-1023px)
- 使用 `logo-horizontal.svg`
- 推荐尺寸: 240×48px

### 移动端 (≤767px)
- 使用 `logo-icon.svg`
- 推荐尺寸: 48×48px

## 🔧 技术特性

### SVG优势
- ✅ 矢量图形，无损缩放
- ✅ 文件体积小，加载快速
- ✅ 支持CSS样式控制
- ✅ 现代浏览器全兼容

### PNG规格
- **16×16px**: 网站图标、书签
- **32×32px**: 小尺寸应用图标
- **64×64px**: 标准应用图标
- **128×128px**: 中等尺寸展示
- **256×256px**: 高清展示

## 📋 使用检查清单

### 网站集成
- [ ] 替换现有favicon.ico
- [ ] 在index.html中添加主logo
- [ ] 在导航栏添加横向logo
- [ ] 配置深色主题logo切换
- [ ] 测试不同设备显示效果

### 品牌一致性
- [ ] 确保所有页面使用统一logo
- [ ] 保持logo尺寸比例正确
- [ ] 验证颜色与网站主题协调
- [ ] 检查在不同背景下的可见性

## 🎭 设计意义

Logo设计体现了海子诗歌的精神内核：
- **太阳** - "面朝大海，春暖花开"的光明主题
- **麦穗** - 对大地和朴素生活的深深眷恋
- **书页** - 诗歌创作和文学传承的永恒价值

每个元素都承载着深刻的文学内涵，在简洁的视觉语言中传达海子诗歌的自然美学和文学价值。

---

*Logo设计完成于2025年7月17日*
*体现海子诗歌的诗意境界与现代网页设计的完美融合*