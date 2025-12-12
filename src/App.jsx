import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className='flex flex-col min-h-screen font-sans'>
      {/* 导航栏 - 固定在页面最上层 */}
      <header className='fixed top-0 left-0 right-0 h-12 bg-white z-[1000] shadow-sm'>
        <div className='max-w-7xl mx-auto h-full px-6 flex justify-between items-center'>
          <div className='text-xl font-semibold text-primary'>智能路线规划</div>
          <ul className='flex gap-6 list-none'>
            <li>
              <Link to='/' className='text-primary text-base font-medium px-3 py-2 rounded-md transition-all duration-300 hover:bg-blue-50 hover:text-primary-dark hover:-translate-y-0.5 inline-block'>
                首页
              </Link>
            </li>
            <li>
              <Link to='/favorites' className='text-primary text-base font-medium px-3 py-2 rounded-md transition-all duration-300 hover:bg-blue-50 hover:text-primary-dark hover:-translate-y-0.5 inline-block'>
                收藏
              </Link>
            </li>
            <li>
              <Link to='/about' className='text-primary text-base font-medium px-3 py-2 rounded-md transition-all duration-300 hover:bg-blue-50 hover:text-primary-dark hover:-translate-y-0.5 inline-block'>
                关于
              </Link>
            </li>
          </ul>
        </div>
      </header>

      {/* 路由出口 - 显示当前路由对应的组件，添加顶部边距避免被导航栏遮挡 */}
      <main className='flex-1 pt-16 w-full pb-12'>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
