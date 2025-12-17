import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import FavoritesPage from './pages/FavoritesPage';
import TestMapPage from './pages/TestMapPage';
import SimpleMapTest from './components/SimpleMapTest';
import LoginPage from './pages/LoginPage';
import AuthGuard from './components/AuthGuard';

// 创建浏览器路由器实例
const router = createBrowserRouter([
  {
    // 使用App组件作为布局组件，包含导航栏和Outlet
    element: <App />,
    // 所有子路由都会通过App组件中的Outlet渲染
    children: [
      // 登录页，不需要保护
      {
        path: '/login',
        element: <LoginPage />,
      },
      // 使用AuthGuard保护需要登录的路由
      {
        element: <AuthGuard />,
        children: [
          {
            path: '/',
            element: <HomePage />,
          },
          {
            path: '/favorites',
            element: <FavoritesPage />,
          },
          {
            path: '/about',
            element: <AboutPage />,
          },
          {
            path: '/test-map',
            element: <TestMapPage />,
          },
          {
            path: '/simple-map-test',
            element: <SimpleMapTest />,
          },
        ],
      },
      {
        // 404 页面
        path: '*',
        element: (
          <div>
            <h1>404 - 页面未找到</h1>
            <p>抱歉，您访问的页面不存在。</p>
          </div>
        ),
      },
    ],
  },
]);

export default router;
