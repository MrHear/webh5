# 🚀 快速启动指南

## ⚡ 一键启动

```bash
# 1. 安装依赖（首次运行）
npm install

# 2. 启动开发服务器
npm run dev

# 3. 浏览器访问
# http://localhost:5173
```

## 📋 项目说明

这是一个**赛博朋克风格**的个人数字生活工作台，采用最新的前端技术栈构建。

### 🎨 视觉特色

- ✨ **玻璃拟态设计** - 半透明、模糊、霓虹边框
- 🌌 **动态星空背景** - 粒子连线动画
- 💫 **打字机效果** - 欢迎文字逐字显示
- 🎆 **霓虹发光** - 悬停时图标发光放大
- 🌈 **赛博配色** - 青色 (#00f0ff)、品红 (#ff00ff)、黄色 (#ffff00)

### 📦 核心功能模块

1. **⚡ 系统仪表盘**
   - CPU / 内存 / 磁盘使用率
   - 网络上传下载速度
   - 今日能量值显示
   - 实时数据动画

2. **🛠️ 工具箱网格**
   - Claude AI、Web 终端、云盘
   - 代码仓库、监控面板、文档中心
   - 悬停发光动画
   - 一键跳转

3. **📝 生活时间轴**
   - 工作 / 生活 / 学习 / 思考分类
   - 时间线可视化
   - 心情 emoji 显示
   - 彩色标签区分

### 🏗️ 技术架构

```
Vue 3 Composition API
    ↓
TypeScript 类型安全
    ↓
Vite 极速构建
    ↓
Tailwind CSS 原子化样式
    ↓
Pinia 状态管理
    ↓
Vue Router 路由控制
    ↓
tsparticles 粒子动画
```

## 🎯 目录结构速览

```
src/
├── components/
│   ├── common/          # 🧩 通用组件
│   ├── dashboard/       # 📊 业务组件
│   └── layout/          # 🖼️ 布局组件
├── views/               # 📄 页面
├── stores/              # 📦 状态管理
├── api/                 # 🌐 接口封装
├── types/               # 📝 TS 类型
└── assets/              # 🎨 样式资源
```

## 🔧 开发命令

```bash
# 开发模式（热更新）
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 类型检查
npm run type-check
```

## 🎨 自定义配置

### 修改主题色

编辑 `tailwind.config.js`:

```javascript
colors: {
  'cyber-primary': '#00f0ff',    // 主色调
  'cyber-secondary': '#ff00ff',  // 次要色
  'cyber-accent': '#ffff00',     // 强调色
}
```

### 修改 API 地址

编辑 `.env`:

```env
VITE_API_BASE_URL=http://your-api-domain.com/api
```

### 添加新工具

编辑 `src/components/dashboard/ToolboxGrid.vue`:

```typescript
{
  id: 9,
  name: '新工具',
  description: '工具描述',
  icon: '🔧',
  url: 'https://example.com',
  category: '分类',
  color: '#00ff88'
}
```

## 📚 组件使用示例

### 使用玻璃卡片

```vue
<template>
  <GlassCard :hoverable="true">
    <h3>标题</h3>
    <p>内容</p>
  </GlassCard>
</template>

<script setup lang="ts">
import GlassCard from '@/components/common/GlassCard.vue'
</script>
```

## 🐛 常见问题

**Q: 启动后页面空白？**
A: 检查浏览器控制台是否有错误，确保所有依赖已安装。

**Q: Tailwind 样式不生效？**
A: 重启开发服务器 (Ctrl+C 然后 npm run dev)。

**Q: TypeScript 报错？**
A: 运行 `npm run type-check` 查看具体错误。

**Q: 粒子背景不显示？**
A: 检查 StarBackground 组件是否正确导入并使用。

## 📖 更多文档

- 详细开发指南：[DEVELOPMENT.md](./DEVELOPMENT.md)
- 项目介绍：[README.md](./README.md)

## 🎉 开始使用

访问 http://localhost:5173 查看效果！

---

**Enjoy your Digital Command Center! 🚀✨**
