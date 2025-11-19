import React, { useEffect, useRef } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';

const HomePage = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    // 检查环境变量中的API密钥

    // 初始化地图
    AMapLoader.load({
      key: '3884b913b5c13c992acf6a9198c3bee8', // 使用环境变量或默认值
      version: '2.0',
      plugins: [], // 暂时不加载额外插件
    })
      .then((AMap) => {
        console.log('AMap 对象加载成功:', AMap);

        // 创建地图实例 - 以杭州西湖为中心
        map.current = new AMap.Map(mapContainer.current, {
          viewMode: '2D',
          zoom: 14,
          center: [120.143811, 30.258455], // 杭州西湖坐标
          resizeEnable: true,
        });

        console.log('地图实例创建成功');
      })
      .catch((e) => {
        console.error('地图加载失败:', e);
      });

    // 清理函数
    return () => {
      if (map.current) {
        map.current.destroy();
        console.log('地图实例已销毁');
      }
    };
  }, []);

  return (
    <div className='fixed inset-0 w-screen h-screen bg-gray-100 overflow-hidden'>
      {/* 地图容器占满整个屏幕 */}
      <div ref={mapContainer} className='w-full h-full'></div>
    </div>
  );
};

export default HomePage;
