import React, { useRef, useState } from 'react';
import MapComponent from '../components/MapComponent';
import ControlPanel from '../components/ControlPanel';
import RouteResult from '../components/RouteResult';
import FavoriteModal from '../components/FavoriteModal';

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
  const [showModal, setShowModal] = useState(false);
  const [routeName, setRouteName] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] =
    useState(false);

  // 地图加载完成回调
  const handleMapReady = (mapServices) => {
    mapRef.current = mapServices.map;
    servicesRef.current = mapServices;
    AMapRef.current = mapServices.AMap; // 保存 AMap 对象
  };

  // 处理起点输入变化，实现地址补全
  const handleOriginInputChange = (value) => {
    if (!value || !AMapRef.current) return;

    // 使用 AMap.AutoComplete 服务获取地址建议
    const autoComplete = new AMapRef.current.AutoComplete({
      city: '全国',
      output: 'all',
    });

    autoComplete.search(value, (status, result) => {
      if (status === 'complete' && result && result.tips) {
        setOriginSuggestions(result.tips);
        setShowOriginSuggestions(true);
      } else {
        setOriginSuggestions([]);
        setShowOriginSuggestions(false);
      }
    });
  };

  // 处理终点输入变化，实现地址补全
  const handleDestinationInputChange = (value) => {
    if (!value || !AMapRef.current) return;

    // 使用 AMap.AutoComplete 服务获取地址建议
    const autoComplete = new AMapRef.current.AutoComplete({
      city: '全国',
      output: 'all',
    });

    autoComplete.search(value, (status, result) => {
      if (status === 'complete' && result && result.tips) {
        setDestinationSuggestions(result.tips);
        setShowDestinationSuggestions(true);
      } else {
        setDestinationSuggestions([]);
        setShowDestinationSuggestions(false);
      }
    });
  };

  // 选择起点建议
  const handleOriginSuggestionSelect = (suggestion) => {
    setOrigin(suggestion.name);
    setShowOriginSuggestions(false);
    setOriginSuggestions([]);
  };

  // 选择终点建议
  const handleDestinationSuggestionSelect = (suggestion) => {
    setDestination(suggestion.name);
    setShowDestinationSuggestions(false);
    setDestinationSuggestions([]);
  };

  // 计算路线
  const calculateRoute = () => {
    if (!origin || !destination) {
      alert('请输入起点和终点');
      return;
    }

    if (!servicesRef.current) {
      alert('地图服务尚未初始化，请稍后重试');
      return;
    }

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

    // 清除之前的路线
    if (routePolylineRef.current && mapRef.current) {
      mapRef.current.remove(routePolylineRef.current);
    }

    service.search([origin, destination], (status, result) => {
      if (status === 'complete') {
        // 处理路线结果
        handleRouteResult(result);
      } else {
        console.error('路线计算失败:', result);
        alert('路线计算失败，请检查输入的地址');
      }
    });
  };

  // 处理路线结果
  const handleRouteResult = (result) => {
    if (!result.routes || result.routes.length === 0) {
      alert('未找到可用路线');
      return;
    }

    const route = result.routes[0];

    // 绘制路线
    const polyline = new AMapRef.current.Polyline({
      path: route.path,
      strokeColor: '#1890ff',
      strokeWeight: 5,
      strokeOpacity: 0.8,
    });

    mapRef.current.add(polyline);
    routePolylineRef.current = polyline;

    // 调整地图视野
    mapRef.current.setFitView([polyline]);

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
  };

  // 收藏路线
  const handleFavorite = () => {
    if (!routeResult) {
      alert('请先计算路线');
      return;
    }
    setShowModal(true);
    setRouteName(`${origin} 到 ${destination}`);
  };

  // 保存收藏
  const saveFavorite = () => {
    if (!routeName.trim()) {
      alert('请输入路线名称');
      return;
    }

    const newFavorite = {
      id: Date.now().toString(),
      name: routeName,
      origin: routeResult.origin,
      destination: routeResult.destination,
      originLatLng: routeResult.polyline[0],
      destinationLatLng: routeResult.polyline[routeResult.polyline.length - 1],
      mode: routeResult.mode,
      distance: routeResult.distance,
      duration: routeResult.duration,
      polyline: JSON.stringify(routeResult.polyline),
      createdAt: new Date().toISOString(),
    };

    // 保存到localStorage
    const storedFavorites = localStorage.getItem('routePlanning_favorites');
    const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    favorites.push(newFavorite);
    localStorage.setItem('routePlanning_favorites', JSON.stringify(favorites));

    setShowModal(false);
    setRouteName('');
    alert('路线收藏成功');
  };

  return (
    <div className='relative w-full h-[calc(100vh-64px)] bg-gray-100 overflow-hidden'>
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
        originSuggestions={originSuggestions}
        destinationSuggestions={destinationSuggestions}
        showOriginSuggestions={showOriginSuggestions}
        showDestinationSuggestions={showDestinationSuggestions}
        onOriginInputChange={handleOriginInputChange}
        onDestinationInputChange={handleDestinationInputChange}
        onOriginSuggestionSelect={handleOriginSuggestionSelect}
        onDestinationSuggestionSelect={handleDestinationSuggestionSelect}
      />

      {/* 路线结果 - 右侧面板 */}
      <div className='absolute top-5 right-5 w-[350px] bg-white rounded-lg shadow-md p-5 z-[100] max-h-[calc(100vh-100px)] overflow-y-auto'>
        <RouteResult routeResult={routeResult} onFavorite={handleFavorite} />
      </div>

      {/* 收藏弹窗 */}
      <FavoriteModal
        showModal={showModal}
        setShowModal={setShowModal}
        routeName={routeName}
        setRouteName={setRouteName}
        onSave={saveFavorite}
      />
    </div>
  );
};

export default HomePage;
