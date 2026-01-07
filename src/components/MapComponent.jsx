import React, { useEffect, useRef } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
// 使用 React.memo 防止不必要的重新渲染
const MapComponent = React.memo(({ onMapReady }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const AMapRef = useRef(null); // 保存AMap实例
  const isMounted = useRef(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current || !mapContainer.current) {
      return;
    }

    isMounted.current = true;
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
        // 检查组件是否已卸载
        if (!isMounted.current) {
          console.log('组件已卸载，取消地图初始化');
          return;
        }

        // 保存AMap实例到ref
        AMapRef.current = AMap;

        // 创建地图实例 - 以杭州西湖为中心
        map.current = new AMap.Map(mapContainer.current, {
          viewMode: '2D',
          zoom: 14,
          center: [120.3386, 30.3164], // 杭州西湖坐标
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

        // 定义路线相关函数
        const drawRoute = (route) => {
          if (!map.current || !AMapRef.current) {
            console.error('地图或AMap实例未初始化');
            return;
          }

          try {
            // 简单的路线绘制实现
            const path = route.path || [];
            
            if (path.length === 0) {
              console.error('路线数据解析失败，path为空');
              return;
            }

            // 添加路线到地图
            const polyline = new AMap.Polyline({
              path: path,
              strokeColor: '#36648B',
              strokeWeight: 6,
              strokeOpacity: 0.8,
            });
            map.current.add(polyline);
            map.current.setFitView([polyline], false, [50, 50, 50, 50]);
          } catch (error) {
            console.error('绘制路线时出错:', error);
          }
        };

        const clearRoute = () => {
          if (map.current) {
            map.current.clearMap();
          }
        };

        const parseRouteToPath = (route) => {
          return route.path || [];
        };

        // 标记为已初始化
        hasInitialized.current = true;

        // 地图加载完成后通知父组件
        if (onMapReady) {
          console.log('调用 onMapReady 回调');
          onMapReady({
            map: map.current,
            AMap: AMap,
            driving: driving,
            walking: walking,
            transfer: transfer,
            drawRoute: drawRoute,
            clearRoute: clearRoute,
            parseRouteToPath: parseRouteToPath,
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
      isMounted.current = false;
      if (map.current) {
        map.current.destroy();
        console.log('地图实例已销毁');
      }
      hasInitialized.current = false;
    };
  }, [onMapReady]);

  return <div ref={mapContainer} className='w-full h-full'></div>;
});

export default MapComponent;