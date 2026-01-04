# 🎯 项目开发指南

## 📦 已安装的依赖包

### 核心依赖
- `vue@^3.x` - Vue 3 框架
- `vue-router@4` - Vue 路由
- `pinia` - 状态管理
- `axios` - HTTP 客户端
- `@tsparticles/vue3` - 粒子动画
- `@tsparticles/slim` - tsparticles 精简版

### 开发依赖
- `vite@^7.x` - 构建工具
- `typescript@~5.x` - TypeScript
- `@vitejs/plugin-vue` - Vite Vue 插件
- `tailwindcss@latest` - Tailwind CSS
- `@tailwindcss/postcss` - Tailwind PostCSS 插件
- `postcss@latest` - PostCSS
- `autoprefixer@latest` - 自动添加 CSS 前缀

## 🎨 设计系统

### 赛博朋克配色方案

```css
/* 主色调 */
--cyber-primary: #00f0ff     /* 霓虹青色 - 主要强调 */
--cyber-secondary: #ff00ff   /* 霓虹品红 - 次要强调 */
--cyber-accent: #ffff00      /* 霓虹黄色 - 点缀 */

/* 背景色 */
--cyber-dark: #0a0a0f        /* 深色背景 */
--cyber-darker: #050508      /* 更深背景 */
```

### 玻璃拟态效果

所有面板使用 `.glass-panel` 类：
- 背景：`rgba(10, 10, 15, 0.6)` - 60% 透明度
- 模糊：`backdrop-filter: blur(10px)`
- 边框：`1px solid rgba(0, 240, 255, 0.2)` - 青色半透明
- 发光：`box-shadow` 实现霓虹效果

### 动画效果

1. **发光动画** (`.animate-glow`)
   - 0%: 小范围发光
   - 100%: 大范围发光
   - 持续时间：2秒，无限循环

2. **浮动动画** (`.animate-float`)
   - 上下浮动 10px
   - 持续时间：3秒，无限循环

3. **打字机效果**
   - 使用 `setInterval` 逐字显示
   - 间隔：100ms

## 🧩 组件使用指南

### GlassCard 组件

```vue
<template>
  <GlassCard :hoverable="true">
    <!-- 你的内容 -->
  </GlassCard>
</template>

<script setup>
import GlassCard from '@/components/common/GlassCard.vue'
</script>
```

**Props:**
- `hoverable`: boolean - 是否启用悬停效果（默认 false）

### StarBackground 组件

```vue
<template>
  <StarBackground />
</template>

<script setup>
import StarBackground from '@/components/common/StarBackground.vue'
</script>
```

全屏背景，自动 `position: fixed` 并设置 `z-index: -1`

## 📡 API 使用示例

### 调用后端接口

```typescript
import { getServerStatus, getLifeLogs } from '@/api/server'

// 获取服务器状态
const status = await getServerStatus()

// 获取生活日志
const logs = await getLifeLogs({ page: 1, pageSize: 10 })
```

### Axios 拦截器

已配置：
- 请求拦截器：自动添加 Authorization token
- 响应拦截器：统一错误处理

## 🎭 TypeScript 类型定义

所有类型定义在 `src/types/index.ts`：

```typescript
import type { ToolItem, LifeLog, ServerStatus, User } from '@/types'
```

## 🔧 开发技巧

### 路径别名

已配置 `@` 指向 `src/` 目录：

```typescript
// ✅ 推荐
import { useSystemStore } from '@/stores/system'
import GlassCard from '@/components/common/GlassCard.vue'

// ❌ 不推荐
import { useSystemStore } from '../../../stores/system'
```

### Tailwind 自定义类

在 `src/assets/main.css` 中扩展：

```css
@layer components {
  .your-custom-class {
    /* 你的样式 */
  }
}
```

### 响应式设计

Tailwind 断点：
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

使用示例：
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  <!-- 移动端 1 列，平板 2 列，桌面 4 列 -->
</div>
```

## 🚀 命令速查

```bash
# 安装依赖
npm install

# 开发模式（热更新）
npm run dev

# 类型检查
npm run type-check

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 📝 Mock 数据位置

当前 Mock 数据直接在组件中定义（方便演示）：

- **StatusPanel.vue**: 服务器状态数据
- **ToolboxGrid.vue**: 工具列表数据
- **LifeTimeline.vue**: 生活日志数据

### 迁移到真实 API

1. 删除组件中的 `const data = ref(mockData)`
2. 使用 `onMounted` 调用 API
3. 示例：

```typescript
import { onMounted, ref } from 'vue'
import { getServerStatus } from '@/api/server'

const status = ref<ServerStatus | null>(null)

onMounted(async () => {
  status.value = await getServerStatus()
})
```

## 🎨 自定义主题

修改 `tailwind.config.js` 的 `theme.extend.colors`：

```javascript
colors: {
  'cyber-primary': '#00f0ff',    // 改成你喜欢的颜色
  'cyber-secondary': '#ff00ff',
  'cyber-accent': '#ffff00',
}
```

## 🐛 常见问题

### TypeScript 报错找不到模块

确保 `tsconfig.app.json` 中配置了路径别名：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Tailwind 样式不生效

1. 检查 `tailwind.config.js` 的 `content` 配置
2. 确保导入了 `src/assets/main.css`
3. 重启开发服务器

### 粒子背景不显示

检查：
1. 是否正确导入并注册 `Particles` 插件（在 `main.ts`）
2. `StarBackground.vue` 的 `z-index` 是否为 -1

---

**Happy Coding! 🚀**
