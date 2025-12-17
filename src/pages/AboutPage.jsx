import React from 'react';

const AboutPage = () => {
  return (
    <div className='p-5 bg-gray-100 min-h-[calc(100vh-64px)]'>
      <div className='max-w-7xl mx-auto px-5'>
        <h1 className='text-2xl font-semibold text-primary mb-5 text-center'>
          关于智能路线规划系统
        </h1>

        <div className='max-w-3xl mx-auto bg-white rounded-lg shadow-md p-7'>
          <div className='mb-7'>
            <h2 className='text-xl font-semibold text-primary mb-4 pb-2 border-b-2 border-blue-50'>
              项目简介
            </h2>
            <p className='text-gray-700 leading-relaxed mb-3'>
              智能路线规划系统是一个基于 React + Vite 与高德地图 JavaScript API
              开发的纯前端应用，旨在为用户提供便捷的路线规划服务。
            </p>
          </div>

          <div className='mb-7'>
            <h2 className='text-xl font-semibold text-primary mb-4 pb-2 border-b-2 border-blue-50'>
              核心功能
            </h2>
            <ul className='list-disc pl-5'>
              <li className='text-gray-700 leading-relaxed mb-2'>
                起点终点路线规划
              </li>
              <li className='text-gray-700 leading-relaxed mb-2'>
                支持驾车、步行、公交三种交通方式
              </li>
              <li className='text-gray-700 leading-relaxed mb-2'>
                路线收藏、编辑、删除功能
              </li>
              <li className='text-gray-700 leading-relaxed mb-2'>
                本地数据持久化存储
              </li>
            </ul>
          </div>

          <div className='mb-7'>
            <h2 className='text-xl font-semibold text-primary mb-4 pb-2 border-b-2 border-blue-50'>
              技术栈
            </h2>
            <div className='flex flex-wrap gap-2.5'>
              <div className='bg-blue-50 text-primary px-4 py-2 rounded-full text-sm font-medium border border-blue-200'>
                React 19
              </div>
              <div className='bg-blue-50 text-primary px-4 py-2 rounded-full text-sm font-medium border border-blue-200'>
                Vite 7
              </div>
              <div className='bg-blue-50 text-primary px-4 py-2 rounded-full text-sm font-medium border border-blue-200'>
                React Router 7
              </div>
              <div className='bg-blue-50 text-primary px-4 py-2 rounded-full text-sm font-medium border border-blue-200'>
                Tailwind CSS 4
              </div>
              <div className='bg-blue-50 text-primary px-4 py-2 rounded-full text-sm font-medium border border-blue-200'>
                高德地图 JS API
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
