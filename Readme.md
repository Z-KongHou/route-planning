# 智能路线规划系统（React + Vite + 高德地图）

## 项目简介

本项目是一个基于 **React + Vite** 与 **高德地图 JavaScript API** 开发的纯前端“智能路线规划”系统，用户可以输入起点与终点，系统会自动呈现最优路线，并支持路线收藏、编辑、删除以及本地持久化。

## 系统功能

### 核心功能

- ✅ **路线规划**：支持驾车、步行、公交三种交通方式
- ✅ **路线收藏**：支持路线的收藏、编辑、删除和管理
- ✅ **本地存储**：使用 localStorage 持久化保存用户数据
- ✅ **用户认证**：支持用户登录功能
- ✅ **多页面视图**：包含首页、收藏页、关于页、登录页和文档页
- ✅ **文档系统**：内置项目文档浏览功能

### 技术栈

| 模块     | 技术                                    |
| -------- | --------------------------------------- |
| 框架     | React 19                                |
| 构建工具 | Vite                                    |
| 路由     | React Router                            |
| 地图 API | 高德地图 JS API                         |
| UI       | Tailwind                                |
| 持久化   | localStorage                            |
| 文档处理 | markdown-it + react-markdown            |
| 代码高亮 | highlight.js + react-syntax-highlighter |

## 快速开始

### 环境要求

- Node.js >= 18
- 支持主流浏览器（Chrome、Firefox、Safari、Edge）
- pnpm（推荐）或 npm/yarn

### 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 启动开发服务器

```bash
# 使用 pnpm
pnpm dev

# 或使用 npm
npm run dev

# 或使用 yarn
yarn dev
```

开发服务器启动后，访问 `http://localhost:5173` 即可查看应用。

### 登录系统

系统默认进入登录页面，您可以使用测试账号登录：

- 测试账号：test
- 测试密码：123456

## 功能使用指南

### 1. 路线规划

1. **进入首页**：登录成功后，系统自动跳转至首页
2. **输入起点和终点**：
   - 在“起点”输入框中输入起点地址（例如：“北京市朝阳区建国路 88 号”）
   - 在“终点”输入框中输入终点地址（例如：“北京市海淀区中关村大街 1 号”）
3. **选择交通方式**：
   - 点击交通方式选项卡，选择“驾车”、“步行”或“公交”
   - 默认选择“驾车”
4. **搜索路线**：
   - 点击“搜索路线”按钮
   - 系统会调用高德地图 API 计算最优路线
   - 地图上会显示路线，右侧会显示路线详情（距离、时间、关键路段）

### 2. 路线收藏

1. **收藏当前路线**：

   - 在路线规划结果页面，点击“收藏路线”按钮
   - 系统会弹出对话框，要求输入路线名称
   - 输入名称后，点击“确定”按钮
   - 收藏成功后，系统会自动保存到本地存储

2. **管理收藏路线**：
   - 点击页面顶部导航栏的“收藏”按钮，进入收藏页面
   - 收藏页面显示所有收藏的路线，包括名称、起点、终点、交通方式和创建时间
   - 每条路线右侧有“编辑”和“删除”按钮，可对路线进行管理
   - 点击路线名称可在地图上查看该路线

### 3. 其他功能

- **关于页面**：点击导航栏的“关于”按钮，查看系统介绍
- **文档页面**：点击导航栏的“文档”按钮，浏览项目文档
- **地图测试**：点击导航栏的“地图测试”按钮，进入地图测试页面
- **退出登录**：点击导航栏的“退出”按钮，退出当前账号

## 项目结构

```
├── dist/              # 构建输出目录
├── public/            # 公共静态资源
│   └── docs/          # 项目文档
├── src/               # 源代码目录
│   ├── assets/        # 项目资源
│   ├── components/    # 组件目录
│   │   ├── AuthGuard.jsx     # 权限守卫组件
│   │   ├── ControlPanel.jsx   # 控制面板组件
│   │   ├── FavoriteModal.jsx  # 收藏模态框组件
│   │   ├── MapComponent.jsx   # 地图组件
│   │   ├── RouteOptions.jsx   # 路线选项组件
│   │   ├── RouteResult.jsx    # 路线结果组件
│   │   └── SimpleMapTest.jsx  # 简单地图测试组件
│   ├── pages/         # 页面组件
│   │   ├── AboutPage.jsx      # 关于页面
│   │   ├── DocsPage.jsx       # 文档页面
│   │   ├── FavoritesPage.jsx  # 收藏页面
│   │   ├── HomePage.jsx       # 首页（地图 + 路线规划）
│   │   ├── LoginPage.jsx      # 登录页面
│   │   └── TestMapPage.jsx    # 地图测试页面
│   ├── test/          # 测试文件目录
│   ├── utils/         # 工具函数
│   │   ├── auth.js            # 认证相关工具
│   │   └── route.js           # 路线相关工具
│   ├── App.css        # 全局样式
│   ├── App.jsx        # 根组件
│   ├── index.css      # 基础样式
│   ├── index.html     # HTML模板
│   ├── main.jsx       # 入口文件
│   └── routes.jsx     # 路由配置
├── .gitignore         # Git忽略文件
├── README.md          # 项目说明文档
├── eslint.config.js   # ESLint配置
├── package.json       # 项目配置
├── pnpm-lock.yaml     # 依赖锁定文件
├── tailwind.config.js # Tailwind配置
└── vite.config.js     # Vite配置
```

## 常见问题

### 1. 路线计算失败怎么办？

- 检查输入的起点和终点是否正确
- 检查网络连接是否正常
- 尝试刷新页面后重新搜索

### 2. 收藏的路线丢失了怎么办？

- 收藏的路线存储在浏览器的 localStorage 中
- 请不要清除浏览器缓存或使用隐私模式
- 如果清除了缓存，收藏的路线将无法恢复

### 3. 地图加载缓慢怎么办？

- 检查网络连接是否正常
- 尝试刷新页面
- 关闭浏览器中的其他标签页，释放资源

### 4. 支持哪些交通方式？

- 驾车
- 步行
- 公交

## 开发指南

### 构建项目

```bash
# 使用 pnpm
pnpm build

# 或使用 npm
npm run build

# 或使用 yarn
yarn build
```

构建产物将输出到 `dist` 目录。（这里可以根据实际情况在 `vite.config.js` 中配置输出目录）

### 预览构建结果

```bash
# 使用 pnpm
pnpm preview

# 或使用 npm
npm run preview

# 或使用 yarn
yarn preview
```

### 代码检查

```bash
# 使用 pnpm
pnpm lint

# 或使用 npm
npm run lint

# 或使用 yarn
yarn lint
```

## 系统运行流程

```
用户登录 → 进入首页 → 输入起点终点 → 选择交通方式 → 搜索路线 →
地图渲染路线 → 查看路线详情 → 收藏路线 → 管理收藏 →
退出登录
```
