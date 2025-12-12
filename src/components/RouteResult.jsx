import React from 'react';

const RouteResult = ({ routeResult, onFavorite }) => {
  if (!routeResult) return null;

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-md border-l-4 border-primary">
      <h3 className="text-lg font-semibold text-primary mb-3">路线信息</h3>
      <div className="flex justify-between mb-2 text-sm">
        <span className="text-gray-600 font-medium">距离：</span>
        <span className="text-gray-900 font-semibold">
          {routeResult.distance}
        </span>
      </div>
      <div className="flex justify-between mb-2 text-sm">
        <span className="text-gray-600 font-medium">时间：</span>
        <span className="text-gray-900 font-semibold">
          {routeResult.duration}
        </span>
      </div>
      <div className="flex justify-between mb-2 text-sm">
        <span className="text-gray-600 font-medium">交通方式：</span>
        <span className="text-gray-900 font-semibold">
          {routeResult.mode === 'drive'
            ? '驾车'
            : routeResult.mode === 'walk'
            ? '步行'
            : '公交'}
        </span>
      </div>
      {/* 收藏按钮 */}
      <button 
        onClick={onFavorite} 
        className="w-full py-2.5 bg-green-500 text-white font-medium rounded-md cursor-pointer transition-all duration-300 hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-lg mt-4"
      >
        收藏路线
      </button>
    </div>
  );
};

export default RouteResult;
