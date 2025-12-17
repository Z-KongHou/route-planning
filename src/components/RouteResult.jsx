import React, { useState } from 'react';

const RouteResult = ({ routeResult, onFavorite, routeDetails }) => {
  const [expandedStep, setExpandedStep] = useState(null);

  if (!routeResult) return null;

  // 格式化时间
  const formatTime = (seconds) => {
    if (!seconds) return '未知';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`;
    }
    return `${minutes}分钟`;
  };

  // 格式化距离
  const formatDistance = (meters) => {
    if (!meters) return '未知';
    if (meters < 1000) {
      return `${meters}米`;
    }
    return `${(meters / 1000).toFixed(1)}公里`;
  };

  // 获取路线类型的中文名称
  const getRouteTypeName = (type) => {
    const typeMap = {
      drive: '驾车',
      walk: '步行',
      bus: '公交',
    };
    return typeMap[type] || '未知';
  };

  // 获取路线策略的中文名称
  const getPolicyName = (policy) => {
    const policyMap = {
      LEAST_TIME: '最快捷',
      LEAST_FEE: '最经济',
      LEAST_DISTANCE: '最短距离',
      REAL_TRAFFIC: '实时路况',
    };
    return policyMap[policy] || '推荐路线';
  };

  // 切换步骤展开状态
  const toggleStep = (index) => {
    setExpandedStep(expandedStep === index ? null : index);
  };

  return (
    <div className='bg-white rounded-md shadow-sm border border-gray-200 p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-lg font-semibold text-gray-800'>路线详情</h3>
        <span className='px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full'>
          {getRouteTypeName(routeResult.mode)}
        </span>
      </div>

      {/* 基本信息 */}
      <div className='grid grid-cols-2 gap-4 mb-4'>
        <div className='bg-gray-50 p-3 rounded-md'>
          <div className='text-sm text-gray-600 mb-1'>总距离</div>
          <div className='text-lg font-semibold text-gray-800'>
            {routeResult.distance}
          </div>
        </div>
        <div className='bg-gray-50 p-3 rounded-md'>
          <div className='text-sm text-gray-600 mb-1'>预计时间</div>
          <div className='text-lg font-semibold text-gray-800'>
            {routeResult.duration}
          </div>
        </div>
      </div>

      {/* 路线策略 */}
      {routeResult.policy && (
        <div className='mb-4'>
          <div className='text-sm text-gray-600 mb-1'>路线策略</div>
          <div className='text-md font-medium text-gray-800'>
            {getPolicyName(routeResult.policy)}
          </div>
        </div>
      )}

      {/* 详细路线步骤 */}
      {routeDetails && routeDetails.steps && routeDetails.steps.length > 0 && (
        <div className='mb-4'>
          <div className='text-sm text-gray-600 mb-2'>详细路线</div>
          <div className='space-y-2 max-h-64 overflow-y-auto'>
            {routeDetails.steps.map((step, index) => (
              <div
                key={index}
                className='border border-gray-200 rounded-md p-2 cursor-pointer hover:bg-gray-50'
                onClick={() => toggleStep(index)}
              >
                <div className='flex items-start'>
                  <div className='flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-2'>
                    {index + 1}
                  </div>
                  <div className='flex-grow'>
                    <div className='text-sm font-medium text-gray-800'>
                      {step.instruction || '继续前行'}
                    </div>
                    <div className='text-xs text-gray-600 mt-1'>
                      {step.distance && (
                        <span className='mr-3'>
                          {formatDistance(step.distance)}
                        </span>
                      )}
                      {step.duration && (
                        <span>{formatTime(step.duration)}</span>
                      )}
                    </div>
                    {expandedStep === index && step.road && (
                      <div className='text-xs text-gray-500 mt-1'>
                        道路：{step.road}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 收藏按钮 */}
      <button
        onClick={onFavorite}
        className='w-full py-2.5 bg-green-500 text-white font-medium rounded-md cursor-pointer transition-all duration-300 hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-lg'
      >
        收藏路线
      </button>
    </div>
  );
};

export default RouteResult;
