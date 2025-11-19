import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="app-container">
      {/* 导航栏 - 固定在页面最上层 */}
      <header className="navbar">
        <div className="navbar-container">
          <div className="navbar-title">智能租房指引</div>
          <ul className="navbar-links">
            <li>
              <Link to="/" className="navbar-link">首页</Link>
            </li>
            <li>
              <Link to="/about" className="navbar-link">关于</Link>
            </li>
          </ul>

        </div>
      </header>
      
      {/* 路由出口 - 显示当前路由对应的组件，添加顶部边距避免被导航栏遮挡 */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default App
