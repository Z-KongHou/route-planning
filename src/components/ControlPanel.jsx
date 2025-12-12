import React from 'react';

const ControlPanel = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  mode,
  setMode,
  onSearch,
  originSuggestions,
  destinationSuggestions,
  showOriginSuggestions,
  showDestinationSuggestions,
  onOriginInputChange,
  onDestinationInputChange,
  onOriginSuggestionSelect,
  onDestinationSuggestionSelect,
}) => {
  // 控制下拉框显示隐藏的状态
  const [showDropdown, setShowDropdown] = React.useState(false);
  return (
    <div className='absolute top-5 left-5 w-[300px] bg-white rounded-md shadow-sm p-3 z-[100]'>
      {/* 起点输入 */}
      <div className='mb-3 relative'>
        <input
          type='text'
          id='origin'
          placeholder='起点'
          value={origin}
          onChange={(e) => {
            setOrigin(e.target.value);
            if (onOriginInputChange) {
              onOriginInputChange(e.target.value);
            }
          }}
          className='w-full px-2 py-2 border border-blue-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
        />
        {/* 起点建议列表 */}
        {showOriginSuggestions && originSuggestions.length > 0 && (
          <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-blue-200 rounded-md shadow-sm z-[101] max-h-40 overflow-y-auto'>
            {originSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className='px-2 py-1.5 text-sm cursor-pointer hover:bg-blue-50 transition-colors'
                onClick={() => onOriginSuggestionSelect(suggestion)}
              >
                {suggestion.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 终点输入 */}
      <div className='mb-3 relative'>
        <input
          type='text'
          id='destination'
          placeholder='终点'
          value={destination}
          onChange={(e) => {
            setDestination(e.target.value);
            if (onDestinationInputChange) {
              onDestinationInputChange(e.target.value);
            }
          }}
          className='w-full px-2 py-2 border border-blue-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
        />
        {/* 终点建议列表 */}
        {showDestinationSuggestions && destinationSuggestions.length > 0 && (
          <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-blue-200 rounded-md shadow-sm z-[101] max-h-40 overflow-y-auto'>
            {destinationSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className='px-2 py-1.5 text-sm cursor-pointer hover:bg-blue-50 transition-colors'
                onClick={() => onDestinationSuggestionSelect(suggestion)}
              >
                {suggestion.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 交通方式选择和搜索按钮 - 同一行 */}
      <div className='flex gap-2'>
        {/* 自定义交通方式下拉框 */}
        <div className='relative w-16'>
          {/* 下拉框按钮 */}
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className='w-full py-1.5 px-2 border border-blue-200 rounded-md text-xs font-normal text-blue-600 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:border-blue-300 transition-all duration-200 flex items-center justify-between relative'
          >
            <span className='flex-1'>
              {mode === 'drive' ? '驾车' : mode === 'walk' ? '步行' : '公交'}
            </span>
            {/* 自定义箭头 SVG */}
            <svg
              className={`w-3 h-3 text-blue-600 ml-1 transition-transform duration-200 ${
                showDropdown ? 'transform rotate-180' : ''
              }`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M19 9l-7 7-7-7'
              ></path>
            </svg>
          </div>

          {/* 下拉选项列表 */}
          {showDropdown && (
            <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-blue-200 rounded-md shadow-sm z-[101] max-h-40 overflow-y-auto'>
              <div
                className={`px-3 py-1.5 text-xs font-normal cursor-pointer transition-colors ${
                  mode === 'drive'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => {
                  setMode('drive');
                  setShowDropdown(false);
                }}
              >
                驾车
              </div>
              <div
                className={`px-3 py-1.5 text-xs font-normal cursor-pointer transition-colors ${
                  mode === 'walk'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => {
                  setMode('walk');
                  setShowDropdown(false);
                }}
              >
                步行
              </div>
              <div
                className={`px-3 py-1.5 text-xs font-normal cursor-pointer transition-colors ${
                  mode === 'bus'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => {
                  setMode('bus');
                  setShowDropdown(false);
                }}
              >
                公交
              </div>
            </div>
          )}
        </div>

        {/* 搜索按钮 - 占据大部分宽度 */}
        <button
          onClick={onSearch}
          className='flex-1 py-1.5 px-4 bg-blue-600 text-white text-xs font-semibold rounded-md cursor-pointer transition-colors hover:bg-blue-700'
        >
          搜索
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
