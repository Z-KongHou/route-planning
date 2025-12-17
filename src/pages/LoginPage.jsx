import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/auth';

const LoginPage = () => {
  const navigate = useNavigate();
  
  // 表单状态
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  // 错误信息状态
  const [errors, setErrors] = useState({
    username: '',
    password: ''
  });
  
  // 提交状态
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 表单验证函数
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: '',
      password: ''
    };
    
    // 验证用户名
    if (!formData.username.trim()) {
      newErrors.username = '用户名不能为空';
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = '用户名至少需要3个字符';
      isValid = false;
    }
    
    // 验证密码
    if (!formData.password) {
      newErrors.password = '密码不能为空';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少需要6个字符';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // 表单字段变化处理
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 实时验证当前字段
    if (errors[name]) {
      let newError = '';
      if (name === 'username') {
        if (!value.trim()) {
          newError = '用户名不能为空';
        } else if (value.length < 3) {
          newError = '用户名至少需要3个字符';
        }
      } else if (name === 'password') {
        if (!value) {
          newError = '密码不能为空';
        } else if (value.length < 6) {
          newError = '密码至少需要6个字符';
        }
      }
      setErrors(prev => ({
        ...prev,
        [name]: newError
      }));
    }
  };
  
  // 表单提交处理
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 验证表单
    if (validateForm()) {
      setIsSubmitting(true);
      
      // 模拟登录请求延迟
      setTimeout(() => {
        const result = login(formData.username, formData.password);
        if (result.success) {
          // 登录成功，跳转到首页
          navigate('/');
        } else {
          // 登录失败，显示错误信息
          setErrors(prev => ({
            ...prev,
            password: result.error
          }));
          setIsSubmitting(false);
        }
      }, 500);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">智能路线规划</h2>
        <h3 className="text-xl font-semibold text-center text-gray-700 mb-8">登录</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 用户名字段 */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              用户名
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
              placeholder="请输入用户名"
              disabled={isSubmitting}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>
          
          {/* 密码字段 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              密码
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
              placeholder="请输入密码"
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          
          {/* 登录按钮 */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? '登录中...' : '登录'}
            </button>
          </div>
        </form>
        
        {/* 表单说明 */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>测试账号：test</p>
          <p>测试密码：123456</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
