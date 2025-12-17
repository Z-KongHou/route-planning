import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth';

// 路由保护组件，用于保护需要登录才能访问的路由
const AuthGuard = () => {
  // 检查用户是否已登录
  const loggedIn = isLoggedIn();
  
  // 如果已登录，渲染子路由组件；否则重定向到登录页
  return loggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AuthGuard;
