import React, { useEffect, useRef } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
// 使用 React.memo 防止不必要的重新渲染
const MapComponent = React.memo(({ onMapReady }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const AMapRef = useRef(null); // 保存AMap实例
  const isMounted = useRef(false);
  const hasInitialized = useRef(false);

  // 参考demo.tsx实现路线绘制功能
  const drawRoute = (route, routeMode = 'driving') => {
    if (!map.current || !AMapRef.current) {
      console.error('地图或AMap实例未初始化');
      return;
    }

    try {
      const path = parseRouteToPath(route);

      // 检查path是否为空
      if (path.length === 0) {
        console.error('路线数据解析失败，path为空');
        return;
      }

      // 使用保存的AMap实例
      const AMap = AMapRef.current;

      // 创建起点标记
      const startMarker = new AMap.Marker({
        position: path[0],
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
        map: map.current,
      });

      // 创建终点标记
      const endMarker = new AMap.Marker({
        position: path[path.length - 1],
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
        map: map.current,
      });

      // 根据路线模式选择颜色
      let strokeColor = '#0091ff';
      let strokeStyle = 'solid';

      switch (routeMode) {
        case 'walking':
          strokeColor = '#52c41a'; // 绿色
          break;
        case 'transit':
          strokeColor = '#1890ff'; // 蓝色
          break;
        case 'driving':
        default:
          strokeColor = '#0091ff'; // 深蓝色
          break;
      }

      // 创建路线polyline
      const routeLine = new AMap.Polyline({
        path: path,
        isOutline: true,
        outlineColor: '#ffeeee',
        borderWeight: 2,
        strokeWeight: 5,
        strokeColor: strokeColor,
        lineJoin: 'round',
        strokeStyle: strokeStyle,
      });

      routeLine.setMap(map.current);

      // 调整视野达到最佳显示区域
      map.current.setFitView([startMarker, endMarker, routeLine]);

      console.log(`${routeMode}路线绘制完成`);
    } catch (error) {
      console.error('路线绘制失败:', error);
      console.error('错误堆栈:', error.stack);
    }
  };

  // 解析路线数据为路径坐标数组
  const parseRouteToPath = (route) => {
    const path = [];

    try {
      // 首先检查route是否有直接的path属性（驾车路线通常有）
      if (route.path && Array.isArray(route.path)) {
        return route.path;
      }
      // 处理驾车和步行路线的steps结构
      else if (route.steps && Array.isArray(route.steps)) {
        for (let i = 0; i < route.steps.length; i++) {
          const step = route.steps[i];
          if (step.path && Array.isArray(step.path)) {
            for (let j = 0; j < step.path.length; j++) {
              path.push(step.path[j]);
            }
          }
        }
      }
      // 处理公交路线的segments结构
      else if (route.segments && Array.isArray(route.segments)) {
        for (let i = 0; i < route.segments.length; i++) {
          const segment = route.segments[i];
          if (segment.transit && segment.transit.path) {
            for (let j = 0; j < segment.transit.path.length; j++) {
              path.push(segment.transit.path[j]);
            }
          }
        }
      }
      // 如果直接是路径数组
      else if (Array.isArray(route)) {
        return route;
      }

      return path;
    } catch (error) {
      console.error('解析路线路径失败:', error);
      return [];
    }
  };

  // 清除所有路线
  const clearRoute = () => {
    if (map.current) {
      const overlays = map.current.getAllOverlays();
      overlays.forEach((overlay) => {
        // 在AMap 2.0中，使用getType()方法获取覆盖物类型
        const type = overlay.getType
          ? overlay.getType()
          : overlay.CLASS_NAME || '';
        if (
          type === 'Polyline' ||
          type === 'Marker' ||
          type.includes('Polyline') ||
          type.includes('Marker')
        ) {
          map.current.remove(overlay);
        }
      });
    }
  };

  useEffect(() => {
    // 防止重复初始化
    if (hasInitialized.current) {
      console.log('MapComponent 已初始化，跳过重复初始化');
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
