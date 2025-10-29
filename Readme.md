# 路线规划应用

基于 Next.js 和 高德地图API 构建的现代化路线规划应用。

## 功能特性

- 🗺️ **高德地图集成** - 使用高德地图JavaScript API
- 🎨 **现代化UI** - 基于 shadcn/ui 和 Tailwind CSS
- 📱 **响应式设计** - 支持桌面端和移动端
- 🔍 **地点搜索** - 搜索框支持地点搜索功能
- 📍 **快速导航** - 热门城市快速定位
- 🎯 **交互功能** - 点击地图获取坐标、定位当前位置

## 技术栈

- **前端框架**: Next.js 16 (App Router)
- **UI组件库**: shadcn/ui
- **样式**: Tailwind CSS
- **地图服务**: 高德地图 JavaScript API
- **语言**: TypeScript

## 快速开始

### 1. 获取高德地图API密钥

1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 注册账号并创建应用
3. 获取Web端JavaScript API的Key

### 2. 配置环境变量

编辑 `.env.local` 文件，填入您的高德地图API密钥：

```env
NEXT_PUBLIC_AMAP_KEY=您的高德地图API密钥
```

### 3. 安装依赖

```bash
npm install
```

### 4. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
route-planning/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── page.tsx      # 首页组件
│   │   └── globals.css   # 全局样式
│   ├── components/       # 组件目录
│   │   ├── ui/          # shadcn/ui 组件
│   │   └── amap-component.tsx  # 高德地图组件
│   └── lib/
│       └── utils.ts     # 工具函数
├── public/              # 静态资源
├── .env.local          # 环境变量配置
└── package.json        # 项目依赖
```

## 主要组件

### AMapComponent

高德地图组件，封装了地图初始化和基本功能：

- 地图加载和初始化
- 工具条、比例尺、定位控件
- 点击事件处理
- 地图销毁清理

### 首页功能

- 顶部导航栏：包含应用标题和搜索框
- 左侧控制面板：地图控制说明和快速导航
- 右侧地图区域：高德地图显示
- 底部信息栏：应用说明

## 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm start` - 启动生产服务器
- `npm run lint` - 运行ESLint检查

## 扩展功能建议

- 集成路线规划API
- 添加地点详情信息
- 实现收藏功能
- 添加路线计算和显示
- 集成天气信息
- 添加多语言支持

## 注意事项

- 请确保在 `.env.local` 文件中正确配置高德地图API密钥
- 高德地图API有免费额度限制，请合理规划使用
- 生产环境部署时，请配置正确的环境变量

## 许可证

MIT License
