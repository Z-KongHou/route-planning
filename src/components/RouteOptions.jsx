import React from 'react';

const RouteOptions = ({
  routeOptions,
  selectedRoute,
  onSelectRoute,
  loading,
}) => {
  if (loading) {
    return (
      <div className='bg-white rounded-md shadow-sm border border-gray-200 p-3'>
        <div className='flex items-center justify-center py-2'>
          <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500'></div>
          <span className='ml-2 text-sm text-gray-600'>加载中...</span>
        </div>
      </div>
    );
  }

  if (!routeOptions || routeOptions.length === 0) {
    return null;
  }

  return (
    <div className='bg-white rounded-md shadow-sm border border-gray-200 p-3'>
      <div className='space-y-1'>
        {routeOptions.map((option, index) => (
          <div
            key={index}
            className={`flex items-center px-3 py-2 rounded-md cursor-pointer transition-all duration-200 ${
              selectedRoute === index
                ? 'bg-blue-50 border border-blue-300'
                : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
            }`}
            onClick={() => onSelectRoute(index)}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-sm font-medium bg-blue-500 text-white`}
            >
              {index + 1}
            </div>
            <span
              className={`text-sm font-medium ${
                selectedRoute === index ? 'text-gray-900' : 'text-gray-700'
              }`}
            >
              Route{index + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteOptions;
