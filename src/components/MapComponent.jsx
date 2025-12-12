import React, { useEffect, useRef } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';

const MapComponent = ({ onMapReady }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    console.log('MapComponent 组件挂载，开始加载地图');
    console.log('地图容器 ref:', mapContainer.current);

    // 初始化地图
    AMapLoader.load({
      key: '3884b913b5c13c992acf6a9198c3bee8', // 使用环境变量或默认值
      version: '2.0',
      plugins: [
        'AMap.Driving',
        'AMap.Walking',
        'AMap.Transfer',
        'AMap.AutoComplete',
        'AMap.Geocoder',
      ], // 加载路线规划所需的插件
    })
      .then((AMap) => {
        console.log('AMap 对象加载成功:', AMap);
        console.log('地图容器:', mapContainer.current);

        // 创建地图实例 - 以杭州西湖为中心
        map.current = new AMap.Map(mapContainer.current, {
          viewMode: '2D',
          zoom: 14,
          center: [120.143811, 30.258455], // 杭州西湖坐标
          resizeEnable: true,
        });

        console.log('地图实例创建成功');

        // 初始化路线规划服务
        const driving = new AMap.Driving({
          policy: AMap.DrivingPolicy.LEAST_TIME,
        });
        const walking = new AMap.Walking();
        const transfer = new AMap.Transfer({
          city: '北京',
          policy: AMap.TransferPolicy.LEAST_TIME,
        });

        // 地图加载完成后通知父组件
        if (onMapReady) {
          console.log('调用 onMapReady 回调');
          onMapReady({
            map: map.current,
            AMap: AMap,
            driving: driving,
            walking: walking,
            transfer: transfer,
          });
        }
      })
      .catch((e) => {
        console.error('地图加载失败:', e);
        console.error('错误堆栈:', e.stack);
      });

    // 清理函数
    return () => {
      console.log('MapComponent 组件卸载，开始清理地图');
      if (map.current) {
        map.current.destroy();
        console.log('地图实例已销毁');
      }
    };
  }, [onMapReady]);

  return <div ref={mapContainer} className='w-full h-full'></div>;
};

export default MapComponent;
