import React, { useRef, useState } from 'react';
import MapComponent from '../components/MapComponent';
import ControlPanel from '../components/ControlPanel';
import RouteResult from '../components/RouteResult';
import RouteOptions from '../components/RouteOptions';
import FavoriteModal from '../components/FavoriteModal';
import AIChatComponent from '../components/AIChatComponent';

const HomePage = () => {
  // 地图相关引用
  const mapRef = useRef(null);
  const servicesRef = useRef(null);
  const routePolylineRef = useRef(null);
  const AMapRef = useRef(null);

  // 状态管理
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [mode, setMode] = useState('drive'); // drive, walk, bus
  const [routeResult, setRouteResult] = useState(null);
  const [routeOptions, setRouteOptions] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [routeDetails, setRouteDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [routeName, setRouteName] = useState('');
  const [AMapInstance, setAMapInstance] = useState(null); // AMap对象状态，用于传递给ControlPanel
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFullRoute, setSelectedFullRoute] = useState(null); // 保存完整路线数据

  // 地图加载完成回调 - 使用 useCallback 缓存，防止不必要的重新渲染
  const handleMapReady = React.useCallback((mapServices) => {
    mapRef.current = mapServices.map;
    servicesRef.current = mapServices;
    AMapRef.current = mapServices.AMap; // 保存 AMap 对象
    setAMapInstance(mapServices.AMap); // 保存到状态中，用于传递给ControlPanel
    console.log('地图服务初始化完成，地图实例:', mapRef.current);
    console.log('AMap 对象保存到状态:', mapServices.AMap);

    // 保存MapComponent中新增的路线绘制函数
    mapServices.drawRoute && (window.drawRoute = mapServices.drawRoute);
    mapServices.clearRoute && (window.clearRoute = mapServices.clearRoute);
    mapServices.parseRouteToPath &&
      (window.parseRouteToPath = mapServices.parseRouteToPath);

    console.log('路线绘制功能已加载');
  }, []);

  // 计算路线
  const calculateRoute = () => {
    console.log('calculateRoute 开始执行');
    console.log('当前起点:', origin);
    console.log('当前终点:', destination);
    console.log('当前交通方式:', mode);

    if (!origin || !destination) {
      console.error('起点或终点为空');
      console.log('请输入起点和终点');
      return;
    }

    if (!servicesRef.current) {
      console.error('servicesRef.current 为空');
      console.log('地图服务尚未初始化，请稍后重试');
      return;
    }

    if (!AMapRef.current) {
      console.error('AMapRef.current 为空');
      console.log('地图服务尚未初始化，请稍后重试');
      return;
    }

    setIsLoading(true);
    setRouteOptions([]);
    setRouteResult(null);
    setRouteDetails(null);

    const { driving, walking, transfer } = servicesRef.current;
    let service;

    switch (mode) {
      case 'drive':
        service = driving;
        break;
      case 'walk':
        service = walking;
        break;
      case 'bus':
        service = transfer;
        break;
      default:
        service = driving;
    }

    console.log('选择的路线服务:', service);

    // 清除之前的路线
    if (routePolylineRef.current && mapRef.current) {
      mapRef.current.remove(routePolylineRef.current);
    }

    // 初始化地理编码服务
    try {
      const geocoder = new AMapRef.current.Geocoder({
        city: '全国',
        radius: 1000,
      });
      console.log('地理编码服务创建成功:', geocoder);

      // 地理编码起点
      geocoder.getLocation(origin, (originStatus, originResult) => {
        console.log('起点地理编码回调:', originStatus, originResult);
        if (originStatus !== 'complete') {
          console.error('起点地理编码失败:', originResult);
          console.log('起点地址解析失败，请检查输入');
          setIsLoading(false);
          return;
        }

        // 地理编码终点
        geocoder.getLocation(destination, (destStatus, destResult) => {
          console.log('终点地理编码回调:', destStatus, destResult);
          if (destStatus !== 'complete') {
            console.error('终点地理编码失败:', destResult);
            console.log('终点地址解析失败，请检查输入');
            setIsLoading(false);
            return;
          }

          // 提取坐标
          const originLngLat = originResult.geocodes[0].location;
          const destLngLat = destResult.geocodes[0].location;

          console.log('起点坐标:', originLngLat);
          console.log('终点坐标:', destLngLat);

          // 根据不同模式获取多个路线方案
          if (mode === 'drive') {
            // 驾车模式获取多个策略的路线
            getMultipleDrivingRoutes(originLngLat, destLngLat);
          } else {
            // 步行和公交模式只获取一条路线
            service.search([originLngLat, destLngLat], (status, result) => {
              console.log('路线规划回调:', status, result);
              if (status === 'complete') {
                // 处理路线结果
                handleRouteResult(result);
              } else {
                console.error('路线计算失败:', result);
                console.log('路线计算失败，请检查输入的地址或尝试其他地址');
                setIsLoading(false);
              }
            });
          }
        });
      });
    } catch (error) {
      console.error('地理编码服务创建失败:', error);
      console.log('地图服务初始化失败，请刷新页面重试');
      setIsLoading(false);
    }
  };

  // 获取多个驾车路线方案
  const getMultipleDrivingRoutes = (originLngLat, destLngLat) => {
    const policies = [
      {
        policy: AMapRef.current.DrivingPolicy.LEAST_TIME,
        name: 'Route 1',
      },
      {
        policy: AMapRef.current.DrivingPolicy.LEAST_FEE,
        name: 'Route 2',
      },
      {
        policy: AMapRef.current.DrivingPolicy.LEAST_DISTANCE,
        name: 'Route 3',
      },
    ];

    let completedRequests = 0;
    const routeResults = [];

    console.log(
      '开始获取多个路线方案，起点:',
      originLngLat,
      '终点:',
      destLngLat
    );

    policies.forEach((policyObj, index) => {
      console.log(`创建路线服务 ${policyObj.name}, 策略:`, policyObj.policy);

      const driving = new AMapRef.current.Driving({
        policy: policyObj.policy,
        map: null, // 不自动显示在地图上
        panel: null, // 不自动显示在面板上
      });

      driving.search(originLngLat, destLngLat, (status, result) => {
        console.log(`${policyObj.name} 路线搜索结果:`, status, result);
        completedRequests++;

        if (
          status === 'complete' &&
          result.routes &&
          result.routes.length > 0
        ) {
          const route = result.routes[0];
          const routeData = {
            index,
            name: policyObj.name,
            description: policyObj.description,
            color: policyObj.color,
            policy: Object.keys(AMapRef.current.DrivingPolicy).find(
              (key) => AMapRef.current.DrivingPolicy[key] === policyObj.policy
            ),
            distance: route.distance
              ? (route.distance / 1000).toFixed(1) + ' km'
              : '未知',
            duration: route.time
              ? (route.time / 60).toFixed(0) + ' 分钟'
              : '未知',
            route: route,
            steps: route.steps || [],
          };

          console.log(`${policyObj.name} 路线数据:`, routeData);
          routeResults.push(routeData);
        } else {
          console.error(`${policyObj.name} 路线搜索失败:`, result);
        }

        // 所有请求完成后更新状态
        if (completedRequests === policies.length) {
          console.log('所有路线搜索完成，结果:', routeResults);

          if (routeResults.length > 0) {
            // 按索引排序
            routeResults.sort((a, b) => a.index - b.index);
            setRouteOptions(routeResults);

            // 默认选择第一条路线
            setSelectedRouteIndex(0);
            displayRoute(routeResults[0].route, routeResults[0].color, 'drive');

            // 保存完整路线数据
            setSelectedFullRoute(routeResults[0].route);

            // 更新路线结果
            setRouteResult({
              origin: origin,
              destination: destination,
              mode: mode,
              policy: routeResults[0].policy,
              distance: routeResults[0].distance,
              duration: routeResults[0].duration,
              polyline: routeResults[0].route.path,
            });

            // 更新路线详情
            setRouteDetails({
              steps: routeResults[0].steps,
            });
          }
          setIsLoading(false);
        }
      });
    });
  };

  // 显示路线 - 参考demo.tsx实现
  const displayRoute = (route, color = '#1890ff', routeMode = 'driving') => {
    console.log('开始渲染路线，模式:', routeMode, '路线数据:', route);
    console.log('地图实例:', mapRef.current);

    if (!mapRef.current) {
      console.error('地图未初始化');
      return;
    }

    // 使用MapComponent中新增的路线绘制功能
    if (window.drawRoute) {
      console.log('使用MapComponent的路线绘制功能');
      try {
        // 清除之前的路线
        if (window.clearRoute) {
          window.clearRoute();
        }

        // 根据路线模式选择颜色
        let mode = routeMode;
        if (mode === 'walk') mode = 'walking';
        if (mode === 'bus') mode = 'transit';
        if (mode === 'drive') mode = 'driving';

        // 使用MapComponent的drawRoute函数绘制路线
        window.drawRoute(route, mode);
        console.log('路线绘制完成');
        return;
      } catch (error) {
        console.error('使用MapComponent路线绘制功能失败:', error);
        // 失败后使用fallback方案
      }
    }

    // 如果MapComponent的绘制功能不可用，使用原有逻辑作为fallback
    console.log('使用原有路线绘制逻辑作为fallback');

    // 清除之前的路线
    clearRoute();

    try {
      // 直接渲染polyline
      renderRoutePolyline(route, color);
    } catch (error) {
      console.error('路线渲染出错:', error);
    }
  };

  // 清除路线
  const clearRoute = () => {
    if (mapRef.current) {
      const overlays = mapRef.current.getAllOverlays();
      overlays.forEach((overlay) => {
        if (
          overlay instanceof AMapRef.current.Polyline ||
          overlay.CLASS_NAME === 'AMap.WalkingRender' ||
          overlay.CLASS_NAME === 'AMap.TransferRender' ||
          overlay.CLASS_NAME === 'AMap.DrivingRender'
        ) {
          mapRef.current.remove(overlay);
        }
      });
    }
    routePolylineRef.current = null;
  };

  // 渲染路线polyline
  const renderRoutePolyline = (routeData, color) => {
    try {
      console.log('使用polyline渲染路线:', routeData);

      const path = routeData.path || routeData;
      if (!path || path.length === 0) {
        console.error('路线数据无效');
        return;
      }

      routePolylineRef.current = new AMapRef.current.Polyline({
        path: path,
        strokeColor: color,
        strokeWeight: 6,
        strokeOpacity: 0.8,
        strokeStyle: 'solid',
      });

      mapRef.current.add(routePolylineRef.current);
      mapRef.current.setFitView([routePolylineRef.current]);
      console.log('polyline路线渲染完成');
    } catch (error) {
      console.error('polyline渲染失败:', error);
    }
  };

  // 选择路线
  const selectRoute = (index) => {
    setSelectedRouteIndex(index);
    const selectedOption = routeOptions[index];

    if (selectedOption) {
      displayRoute(selectedOption.route, selectedOption.color, 'drive');

      // 保存完整路线数据
      setSelectedFullRoute(selectedOption.route);

      // 更新路线结果
      setRouteResult({
        origin: origin,
        destination: destination,
        mode: mode,
        policy: selectedOption.policy,
        distance: selectedOption.distance,
        duration: selectedOption.duration,
        polyline: selectedOption.route.path,
      });

      // 更新路线详情
      setRouteDetails({
        steps: selectedOption.steps,
      });
    }
  };

  // 处理路线结果
  const handleRouteResult = (result) => {
    if (!result.routes || result.routes.length === 0) {
      console.log('未找到可用路线');
      setIsLoading(false);
      return;
    }

    const route = result.routes[0];

    // 绘制路线
    displayRoute(route);

    // 保存完整路线数据
    setSelectedFullRoute(route);

    // 保存路线结果
    setRouteResult({
      origin: origin,
      destination: destination,
      mode: mode,
      distance: route.distance
        ? (route.distance / 1000).toFixed(1) + ' km'
        : '未知',
      duration: route.time ? (route.time / 60).toFixed(0) + ' 分钟' : '未知',
      polyline: route.path,
    });

    // 保存路线详情
    setRouteDetails({
      steps: route.steps || [],
    });

    setIsLoading(false);
  };

  // 收藏路线
  const handleFavorite = () => {
    if (!routeResult) {
      console.log('请先计算路线');
      return;
    }
    setShowModal(true);
    setRouteName(`${origin} 到 ${destination}`);
  };

  // 保存收藏
  const saveFavorite = () => {
    console.log('saveFavorite 开始执行');
    console.log('routeName:', routeName);
    console.log('routeResult:', routeResult);
    console.log('selectedFullRoute:', selectedFullRoute);

    if (!routeName.trim()) {
      console.log('请输入路线名称');
      return;
    }

    if (!routeResult) {
      console.error('routeResult 为空，无法保存收藏');
      return;
    }

    // 确保 polyline 存在且是数组
    let originLatLng = null;
    let destinationLatLng = null;
    let polylineData = null;
    let fullRouteData = null;
    let processedPolyline = null;

    // 处理 polyline 数据，支持多种格式
    if (routeResult.polyline) {
      if (Array.isArray(routeResult.polyline)) {
        processedPolyline = routeResult.polyline;
      } else if (typeof routeResult.polyline === 'string') {
        try {
          processedPolyline = JSON.parse(routeResult.polyline);
          if (!Array.isArray(processedPolyline)) {
            processedPolyline = null;
          }
        } catch (e) {
          console.error('解析polyline字符串失败:', e);
          processedPolyline = null;
        }
      }
    }

    // 如果 selectedFullRoute 中有 path，也可以使用
    if (!processedPolyline && selectedFullRoute && selectedFullRoute.path) {
      if (Array.isArray(selectedFullRoute.path)) {
        processedPolyline = selectedFullRoute.path;
      } else if (typeof selectedFullRoute.path === 'string') {
        try {
          processedPolyline = JSON.parse(selectedFullRoute.path);
          if (!Array.isArray(processedPolyline)) {
            processedPolyline = null;
          }
        } catch (e) {
          console.error('解析selectedFullRoute.path字符串失败:', e);
          processedPolyline = null;
        }
      }
    }

    // 处理 polyline 数据
    if (processedPolyline && processedPolyline.length > 0) {
      originLatLng = processedPolyline[0];
      destinationLatLng = processedPolyline[processedPolyline.length - 1];
      polylineData = JSON.stringify(processedPolyline);
    } else {
      console.warn('routeResult.polyline 无效，无法获取坐标信息');
      // 使用空数组作为默认值
      polylineData = JSON.stringify([]);
    }

    // 保存完整路线数据
    if (selectedFullRoute) {
      fullRouteData = JSON.stringify(selectedFullRoute);
    }

    const newFavorite = {
      id: Date.now().toString(),
      name: routeName,
      origin: routeResult.origin,
      destination: routeResult.destination,
      originLatLng: originLatLng,
      destinationLatLng: destinationLatLng,
      mode: routeResult.mode,
      distance: routeResult.distance,
      duration: routeResult.duration,
      polyline: polylineData,
      fullRoute: fullRouteData, // 保存完整路线数据
      note: '', // 添加空备注字段，保持数据结构一致
      createdAt: new Date().toISOString(),
    };

    console.log('newFavorite:', newFavorite);

    // 保存到localStorage
    const storedFavorites = localStorage.getItem('routePlanning_favorites');
    const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    console.log('storedFavorites:', storedFavorites);
    console.log('favorites:', favorites);

    favorites.push(newFavorite);
    localStorage.setItem('routePlanning_favorites', JSON.stringify(favorites));
    console.log('localStorage 保存成功');

    setShowModal(false);
    setRouteName('');
    console.log('路线收藏成功');
  };

  return (
    <div className='relative w-full h-[calc(100vh-48px)] bg-gray-100 overflow-hidden'>
      {/* 地图容器 */}
      <MapComponent onMapReady={handleMapReady} />

      {/* 左侧控制面板 */}
      <ControlPanel
        origin={origin}
        setOrigin={setOrigin}
        destination={destination}
        setDestination={setDestination}
        mode={mode}
        setMode={setMode}
        onSearch={calculateRoute}
        AMapInstance={AMapInstance} // 传递AMap对象
      />

      {/* 路线方案 - 左下角 */}
      <div className='absolute bottom-5 left-5 w-[300px] z-[100]'>
        <RouteOptions
          routeOptions={routeOptions}
          selectedRoute={selectedRouteIndex}
          onSelectRoute={selectRoute}
          loading={isLoading}
        />
      </div>

      {/* 路线结果 - 右侧面板 */}
      <div className='absolute top-5 right-5 w-[350px] bg-white rounded-lg shadow-md p-5 z-[100] max-h-[calc(100vh-100px)] overflow-y-auto'>
        <RouteResult
          routeResult={routeResult}
          onFavorite={handleFavorite}
          routeDetails={routeDetails}
        />
      </div>

      {/* 调试信息 - 底部面板 */}

      {/* 收藏弹窗 */}
      <FavoriteModal
        showModal={showModal}
        setShowModal={setShowModal}
        routeName={routeName}
        setRouteName={setRouteName}
        onSave={saveFavorite}
      />

      {/* AI谈话组件 */}
      <AIChatComponent />
    </div>
  );
};

export default HomePage;
