// 用户认证工具函数

// 登录 - 保存用户信息到 localStorage
export const login = (username, password) => {
  // 这里简单模拟登录验证，实际项目中应该调用API
  if (username && password) {
    const user = {
      username,
      // 简单生成一个token，实际项目中应该由服务器返回
      token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    localStorage.setItem('user', JSON.stringify(user));
    return { success: true, user };
  }
  return { success: false, error: '用户名和密码不能为空' };
};

// 登出 - 清除localStorage中的用户信息
export const logout = () => {
  localStorage.removeItem('user');
};

// 获取当前用户信息
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
};

// 检查用户是否已登录
export const isLoggedIn = () => {
  return !!getCurrentUser();
};
