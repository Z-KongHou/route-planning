import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';

// 创建浏览器路由器实例
const router = createBrowserRouter([
  {
    // 使用App组件作为布局组件，包含导航栏和Outlet
    element: <App />,
    // 所有子路由都会通过App组件中的Outlet渲染
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
    ],
    // 错误边界
    errorElement: (
      <div>
        <h1>404 - 页面未找到</h1>
        <p>抱歉，您访问的页面不存在。</p>
      </div>
    ),
  },
]);

export default router;