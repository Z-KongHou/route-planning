import React, { useRef, useEffect } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';

const SimpleMapTest = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    // 初始化地图
    AMapLoader.load({
      key: '3884b913b5c13c992acf6a9198c3bee8',
      version: '2.0',
      plugins: ['AMap.Driving', 'AMap.Geocoder'],
    })
      .then((AMap) => {
        // 创建地图实例
        map.current = new AMap.Map(mapContainer.current, {
          viewMode: '2D',
          zoom: 14,
          center: [120.143811, 30.258455], // 杭州西湖坐标
        });

        console.log('地图实例创建成功');

        // 初始化地理编码服务
        const geocoder = new AMap.Geocoder({
          city: '杭州',
          radius: 1000,
        });

        console.log('地理编码服务创建成功');

        // 测试地理编码
        geocoder.getLocation('杭州西湖', (originStatus, originResult) => {
          console.log('起点地理编码结果:', originStatus, originResult);
          if (originStatus === 'complete') {
            const originLngLat = originResult.geocodes[0].location;
            console.log('起点坐标:', originLngLat);

            // 地理编码终点
            geocoder.getLocation('杭州东站', (destStatus, destResult) => {
              console.log('终点地理编码结果:', destStatus, destResult);
              if (destStatus === 'complete') {
                const destLngLat = destResult.geocodes[0].location;
                console.log('终点坐标:', destLngLat);

                // 初始化路线规划服务
                const driving = new AMap.Driving({
                  policy: AMap.DrivingPolicy.LEAST_TIME,
                });

                // 调用路线规划服务
                driving.search([originLngLat, destLngLat], (status, result) => {
                  console.log('路线规划结果:', status, result);
                  if (status === 'complete') {
                    console.log('路线规划成功');
                    console.log('路线信息:', {
                      distance: result.routes[0].distance,
                      duration: result.routes[0].time,
                    });

                    // 绘制路线
                    const polyline = new AMap.Polyline({
                      path: result.routes[0].path,
                      strokeColor: '#1890ff',
                      strokeWeight: 5,
                      strokeOpacity: 0.8,
                    });

                    map.current.add(polyline);
                    map.current.setFitView([polyline]);
                  } else {
                    console.error('路线规划失败:', result);
                  }
                });
              } else {
                console.error('终点地理编码失败:', destResult);
              }
            });
          } else {
            console.error('起点地理编码失败:', originResult);
          }
        });
      })
      .catch((e) => {
        console.error('地图加载失败:', e);
      });

    // 清理函数
    return () => {
      if (map.current) {
        map.current.destroy();
      }
    };
  }, []);

  return (
    <div>
      <h1 className='text-xl font-bold mb-4'>简单地图测试</h1>
      <div ref={mapContainer} className='w-full h-[600px]'></div>
    </div>
  );
};

export default SimpleMapTest;
