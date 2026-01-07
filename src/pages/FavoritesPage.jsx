import React, { useState, useEffect, useRef } from 'react';
import MapComponent from '../components/MapComponent';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editNote, setEditNote] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(null);

  // 地图相关引用 - 参考首页实现
  const mapRef = useRef(null);
  const servicesRef = useRef(null);
  const AMapRef = useRef(null);
  const mapReadyRef = useRef(false);

  // 从localStorage加载收藏的路线
  useEffect(() => {
    const loadFavorites = () => {
      const storedFavorites = localStorage.getItem('routePlanning_favorites');
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        // 确保polyline字段和fullRoute字段是正确格式
        const processedFavorites = parsedFavorites.map((route) => {
          const processedRoute = {
            ...route,
            polyline:
              typeof route.polyline === 'string'
                ? JSON.parse(route.polyline)
                : route.polyline || [],
          };
          // 处理fullRoute字段
          if (route.fullRoute && typeof route.fullRoute === 'string') {
            try {
              processedRoute.fullRoute = JSON.parse(route.fullRoute);
            } catch (e) {
              console.error('解析fullRoute失败:', e);
              processedRoute.fullRoute = null;
            }
          }
          return processedRoute;
        });
        setFavorites(processedFavorites);
      }
    };

    loadFavorites();
  }, []);

  // 地图准备就绪回调 - 参考首页实现
  const handleMapReady = (mapServices) => {
    console.log('地图准备就绪', mapServices);
    mapRef.current = mapServices.map;
    servicesRef.current = mapServices;
    AMapRef.current = mapServices.AMap;
    mapReadyRef.current = true;

    // 保存路线绘制函数到全局，方便调用
    mapServices.drawRoute && (window.drawRoute = mapServices.drawRoute);
    mapServices.clearRoute && (window.clearRoute = mapServices.clearRoute);
  };

  // 删除收藏的路线
  const handleDelete = (id) => {
    const updatedFavorites = favorites.filter((route) => route.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem(
      'routePlanning_favorites',
      JSON.stringify(updatedFavorites)
    );
    // 如果删除的是当前选中的路线，清除地图显示
    if (selectedRoute && selectedRoute.id === id) {
      setSelectedRoute(null);
      clearRoute();
    }
  };

  // 开始编辑路线
  const handleEdit = (route) => {
    setEditingId(route.id);
    setEditName(route.name);
    setEditNote(route.note || '');
  };

  // 保存编辑
  const handleSaveEdit = () => {
    if (!editName.trim()) {
      return;
    }

    const updatedFavorites = favorites.map((route) => {
      if (route.id === editingId) {
        return {
          ...route,
          name: editName,
          note: editNote,
          updatedAt: new Date().toISOString(),
        };
      }
      return route;
    });

    setFavorites(updatedFavorites);
    localStorage.setItem(
      'routePlanning_favorites',
      JSON.stringify(updatedFavorites)
    );
    setEditingId(null);
    setEditName('');
    setEditNote('');
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditNote('');
  };

  // 清除路线 - 参考首页实现
  const clearRoute = () => {
    if (window.clearRoute) {
      window.clearRoute();
    } else if (mapRef.current && AMapRef.current) {
      // 备用清除方案
      const overlays = mapRef.current.getAllOverlays();
      overlays.forEach((overlay) => {
        const type = overlay.getType
          ? overlay.getType()
          : overlay.CLASS_NAME || '';
        if (
          type === 'Polyline' ||
          type === 'Marker' ||
          type.includes('Polyline') ||
          type.includes('Marker') ||
          type.includes('Render')
        ) {
          mapRef.current.remove(overlay);
        }
      });
    }
  };

  // 显示路线 - 参考首页实现
  const displayRoute = (route) => {
    console.log('开始渲染路线，路线数据:', route);

    if (!mapReadyRef.current || !route) {
      console.error('地图未初始化或路线数据无效');
      return;
    }

    // 清除之前的路线
    clearRoute();

    try {
      // 准备用于绘制的路线数据
      let routeToDraw = route;

      // 如果有完整路线数据，优先使用fullRoute
      if (route.fullRoute) {
        console.log('使用完整路线数据绘制');
        routeToDraw = route.fullRoute;
        // 确保mode字段存在
        routeToDraw.mode = route.mode;
      }

      // 使用MapComponent的路线绘制功能
      if (window.drawRoute) {
        console.log('使用MapComponent的路线绘制功能');
        const routeMode =
          routeToDraw.mode === 'drive'
            ? 'driving'
            : routeToDraw.mode === 'walk'
            ? 'walking'
            : 'transit';
        window.drawRoute(routeToDraw, routeMode);
        console.log('路线绘制完成');
      } else if (
        mapRef.current &&
        AMapRef.current &&
        (routeToDraw.polyline || routeToDraw.path)
      ) {
        // 备用绘制方案 - 直接渲染polyline
        console.log('使用备用方案绘制路线');
        // 优先使用path字段，然后是polyline字段
        const path = routeToDraw.path || routeToDraw.polyline;
        if (path && Array.isArray(path) && path.length > 0) {
          const polyline = new AMapRef.current.Polyline({
            path: path,
            strokeColor: '#1890ff',
            strokeWeight: 6,
            strokeOpacity: 0.8,
            strokeStyle: 'solid',
          });
          polyline.setMap(mapRef.current);
          mapRef.current.setFitView([polyline]);
          console.log('备用方案路线绘制完成');
        } else {
          console.error('路线坐标数据无效');
        }
      }
    } catch (error) {
      console.error('路线绘制失败:', error);
      console.error('错误堆栈:', error.stack);
    }
  };

  // 选择路线，在地图上显示
  const handleSelectRoute = (route) => {
    setSelectedRoute(route);
    displayRoute(route);
  };

  return (
    <div className='h-[calc(100vh-64px)] flex flex-col md:flex-row overflow-hidden bg-blue-50'>
      {/* 左侧收藏列表 */}
      <div className='w-full md:w-1/5 p-4 bg-blue-50 flex flex-col overflow-hidden'>
        {/* 收藏列表容器框 */}
        <div className='flex-1 rounded-lg border border-blue-200 bg-white shadow-sm overflow-y-auto'>
          {favorites.length === 0 ? (
            <div className='p-8 text-center text-gray-500'>
              <p className='text-lg mb-2'>暂无收藏的路线</p>
              <p className='text-sm'>您可以在首页规划路线后收藏喜欢的路线</p>
            </div>
          ) : (
            <div className='p-4'>
              {favorites.map((route) => (
                <div
                  key={route.id}
                  className={`mb-4 rounded-lg border p-4 cursor-pointer transition-all duration-300 ${
                    selectedRoute && selectedRoute.id === route.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-blue-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-sm'
                  }`}
                  onClick={() => handleSelectRoute(route)}
                >
                  {editingId === route.id ? (
                    // 编辑模式
                    <div>
                      <div className='mb-3'>
                        <label className='block text-sm font-medium text-blue-700 mb-1'>
                          路线名称
                        </label>
                        <input
                          type='text'
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className='w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300'
                          placeholder='请输入路线名称'
                        />
                      </div>
                      <div className='mb-3'>
                        <label className='block text-sm font-medium text-blue-700 mb-1'>
                          备注
                        </label>
                        <textarea
                          value={editNote}
                          onChange={(e) => setEditNote(e.target.value)}
                          className='w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-y h-20'
                          placeholder='请输入备注信息（可选）'
                        />
                      </div>
                      <div className='flex justify-end gap-2'>
                        <button
                          className='bg-blue-100 text-blue-800 border border-blue-300 px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-all duration-300 hover:bg-blue-200'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelEdit();
                          }}
                        >
                          取消
                        </button>
                        <button
                          className='bg-blue-600 text-white border border-blue-600 px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-all duration-300 hover:bg-blue-700'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveEdit();
                          }}
                        >
                          保存
                        </button>
                      </div>
                    </div>
                  ) : (
                    // 查看模式
                    <>
                      <div className='flex justify-between items-center mb-3'>
                        <h3 className='text-lg font-semibold text-blue-600'>
                          {route.name}
                        </h3>
                        <div className='flex gap-2'>
                          <button
                            className='bg-blue-500 text-white border border-blue-500 px-2 py-1 rounded text-xs font-medium cursor-pointer transition-all duration-300 hover:bg-blue-600'
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(route);
                            }}
                          >
                            编辑
                          </button>
                          <button
                            className='bg-red-500 text-white border border-red-500 px-2 py-1 rounded text-xs font-medium cursor-pointer transition-all duration-300 hover:bg-red-600'
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(route.id);
                            }}
                          >
                            删除
                          </button>
                        </div>
                      </div>
                      <div className='text-sm space-y-2 text-gray-700'>
                        <div className='flex justify-between'>
                          <span className='text-blue-600 font-medium'>
                            起点：
                          </span>
                          <span className='text-gray-900 font-semibold truncate max-w-[60%] text-right'>
                            {route.origin}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-blue-600 font-medium'>
                            终点：
                          </span>
                          <span className='text-gray-900 font-semibold truncate max-w-[60%] text-right'>
                            {route.destination}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-blue-600 font-medium'>
                            交通方式：
                          </span>
                          <span className='text-gray-900 font-semibold'>
                            {route.mode === 'drive'
                              ? '驾车'
                              : route.mode === 'walk'
                              ? '步行'
                              : '公交'}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-blue-600 font-medium'>
                            距离：
                          </span>
                          <span className='text-gray-900 font-semibold'>
                            {route.distance}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-blue-600 font-medium'>
                            时间：
                          </span>
                          <span className='text-gray-900 font-semibold'>
                            {route.duration}
                          </span>
                        </div>
                        {route.note && (
                          <div>
                            <span className='text-blue-600 font-medium block mb-1'>
                              备注：
                            </span>
                            <div className='text-gray-900 font-semibold bg-blue-50 p-2 rounded text-sm'>
                              {route.note}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 右侧地图区域 */}
      <div className='w-full md:w-4/5 p-4 bg-blue-50 flex flex-col overflow-hidden'>
        {/* 地图组件容器框 */}
        <div className='flex-1 rounded-lg border border-blue-200 bg-white shadow-sm overflow-hidden relative'>
          <div className='h-full relative'>
            {/* 直接渲染地图组件，不要条件渲染 */}
            <MapComponent onMapReady={handleMapReady} />
            {/* 地图加载提示 - 绝对定位覆盖在地图上 */}
            {!mapReadyRef.current && (
              <div className='absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-80 text-blue-600 z-10'>
                <div className='text-center'>
                  <p className='text-lg mb-2'>地图加载中...</p>
                  <div className='flex space-x-2 justify-center'>
                    <div className='w-2 h-2 bg-blue-500 rounded-full animate-bounce'></div>
                    <div className='w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-200'></div>
                    <div className='w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-400'></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* 地图提示信息 */}
          {!selectedRoute && (
            <div className='absolute top-4 left-4 right-4 bg-white bg-opacity-90 rounded-lg shadow-md p-4 text-center text-blue-600 z-10'>
              <p className='text-sm'>请从左侧选择一条收藏的路线查看</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
