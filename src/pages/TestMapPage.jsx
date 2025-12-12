import React from 'react';
import MapComponent from '../components/MapComponent';

const TestMapPage = () => {
  const handleMapReady = (mapServices) => {
    console.log('地图加载完成，获取到地图服务:', mapServices);
  };

  return (
    <div className='relative w-full h-[calc(100vh-64px)] bg-gray-100 overflow-hidden'>
      <h1 className='absolute top-5 left-5 z-[200] text-primary bg-white/80 px-5 py-2.5 rounded-lg shadow-md'>
        地图组件测试页面
      </h1>
      <MapComponent onMapReady={handleMapReady} />
    </div>
  );
};

export default TestMapPage;
