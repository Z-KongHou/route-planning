import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import { isLoggedIn, getCurrentUser, logout } from './utils/auth';

function App() {
  // 使用 React Router 提供的 useNavigate 钩子实现无刷新跳转
  const navigate = useNavigate();
  // 使用 useLocation 钩子获取当前路由
  const location = useLocation();

  // 登录状态
  const [loggedIn, setLoggedIn] = useState(false);
  // 当前用户信息
  const [currentUser, setCurrentUser] = useState(null);

  // 检查登录状态的函数
  const checkLoginStatus = () => {
    const user = getCurrentUser();
    setLoggedIn(isLoggedIn());
    setCurrentUser(user);
  };

  // 初始化登录状态和监听路由变化
  useEffect(() => {
    checkLoginStatus();

    // 监听存储变化，以便在其他标签页登出时同步状态
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, [location]); // 当路由变化时重新检查登录状态

  // 登出处理
  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <div className='flex flex-col min-h-screen font-sans'>
      {/* 导航栏 - 固定在页面最上层 */}
      <header className='fixed top-0 left-0 right-0 h-12 bg-white z-[1000] shadow-sm'>
        <div className='w-full h-full pl-[2.375rem] pr-6 flex justify-between items-center'>
          <div className='text-xl font-semibold text-primary'>
            智能路线规划Demo
          </div>
          {/* 标签页部分 - 完全靠右对齐 */}
          <div className='flex items-center space-x-6 ml-auto'>
            {/* 只有登录状态下才显示导航菜单 */}
            {loggedIn && (
              <>
                {/* 首页 */}
                <div
                  onClick={() => navigate('/')}
                  className='text-primary text-base font-medium px-3 py-2 rounded-md cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:text-primary-dark hover:-translate-y-0.5 inline-block'
                >
                  首页
                </div>
                {/* 收藏 */}
                <div
                  onClick={() => navigate('/favorites')}
                  className='text-primary text-base font-medium px-3 py-2 rounded-md cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:text-primary-dark hover:-translate-y-0.5 inline-block'
                >
                  收藏
                </div>
                {/* 关于 */}
                <div
                  onClick={() => navigate('/about')}
                  className='text-primary text-base font-medium px-3 py-2 rounded-md cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:text-primary-dark hover:-translate-y-0.5 inline-block'
                >
                  关于
                </div>
              </>
            )}

            {/* 用户信息/登录按钮 */}
            {loggedIn ? (
              <div className='flex items-center space-x-4'>
                {/* 用户名 */}
                <div className='text-primary text-base font-medium'>
                  {currentUser?.username}
                </div>
                {/* 登出按钮 */}
                <div
                  onClick={handleLogout}
                  className='text-primary text-base font-medium px-3 py-2 rounded-md cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:text-primary-dark hover:-translate-y-0.5 inline-block'
                >
                  登出
                </div>
              </div>
            ) : (
              /* 登录按钮 */
              <div
                onClick={() => navigate('/login')}
                className='text-primary text-base font-medium px-3 py-2 rounded-md cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:text-primary-dark hover:-translate-y-0.5 inline-block'
              >
                登录
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 路由出口 - 显示当前路由对应的组件，添加顶部边距避免被导航栏遮挡 */}
      <main className='flex-1 pt-12 w-full pb-12'>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
