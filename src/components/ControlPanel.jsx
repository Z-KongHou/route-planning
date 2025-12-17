import React, { useState, useRef, useEffect } from 'react';

const ControlPanel = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  mode,
  setMode,
  onSearch,
  AMapInstance,
}) => {
  // 控制下拉框显示隐藏的状态
  const [showDropdown, setShowDropdown] = React.useState(false);

  // 地址补全相关状态
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] =
    useState(false);

  // 当前高亮的建议项索引
  const [originHighlightIndex, setOriginHighlightIndex] = useState(-1);
  const [destinationHighlightIndex, setDestinationHighlightIndex] =
    useState(-1);

  // 防抖相关的 ref
  const originDebounceTimer = useRef(null);
  const destinationDebounceTimer = useRef(null);

  // AMap AutoComplete 实例 ref
  const autoCompleteRef = useRef(null);

  // 初始化 AMap AutoComplete 实例
  useEffect(() => {
    console.log(
      'AMapInstance 状态:',
      AMapInstance ? typeof AMapInstance : 'null'
    );
    if (AMapInstance && !autoCompleteRef.current) {
      autoCompleteRef.current = new AMapInstance.AutoComplete({
        city: '全国',
        output: 'all',
      });
      console.log('AutoComplete 实例创建成功:', autoCompleteRef.current);
    } else if (!AMapInstance) {
      console.log('AMapInstance 未提供，等待地图加载完成');
    }
  }, [AMapInstance]);

  // 处理地址补全请求
  const handleAutoComplete = (value, isOrigin) => {
    console.log('handleAutoComplete 被调用:', { value, isOrigin });

    if (!value) {
      console.log('value 为空，不发送请求');
      return;
    }

    if (!autoCompleteRef.current) {
      console.log('autoCompleteRef.current 为空，无法发送请求');
      return;
    }

    console.log('发送地址补全请求，value:', value);

    autoCompleteRef.current.search(value, (status, result) => {
      console.log('地址补全请求返回:', { status, result });

      if (status === 'complete' && result && result.tips) {
        console.log('地址补全请求成功，结果数量:', result.tips.length);
        // 限制最多5个结果
        const suggestions = result.tips.slice(0, 5);
        console.log('处理后的建议数量:', suggestions.length);

        if (suggestions.length > 0) {
          if (isOrigin) {
            console.log(
              '设置起点建议:',
              suggestions.map((s) => s.name)
            );
            setOriginSuggestions(suggestions);
            setShowOriginSuggestions(true);
            // 重置高亮索引
            setOriginHighlightIndex(-1);
          } else {
            console.log(
              '设置终点建议:',
              suggestions.map((s) => s.name)
            );
            setDestinationSuggestions(suggestions);
            setShowDestinationSuggestions(true);
            // 重置高亮索引
            setDestinationHighlightIndex(-1);
          }
        } else {
          console.log('没有匹配的建议项');
          if (isOrigin) {
            setOriginSuggestions([]);
            setShowOriginSuggestions(false);
            setOriginHighlightIndex(-1);
          } else {
            setDestinationSuggestions([]);
            setShowDestinationSuggestions(false);
            setDestinationHighlightIndex(-1);
          }
        }
      } else {
        console.log('地址补全请求失败:', { status, result });
        if (isOrigin) {
          setOriginSuggestions([]);
          setShowOriginSuggestions(false);
          setOriginHighlightIndex(-1);
        } else {
          setDestinationSuggestions([]);
          setShowDestinationSuggestions(false);
          setDestinationHighlightIndex(-1);
        }
      }
    });
  };

  // 防抖处理的地址补全请求

  // 处理起点输入变化
  const handleOriginChange = (e) => {
    const value = e.target.value;
    setOrigin(value);

    // 防抖请求地址补全
    clearTimeout(originDebounceTimer.current);
    originDebounceTimer.current = setTimeout(() => {
      handleAutoComplete(value, true);
    }, 300);
  };

  // 处理终点输入变化
  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestination(value);

    // 防抖请求地址补全
    clearTimeout(destinationDebounceTimer.current);
    destinationDebounceTimer.current = setTimeout(() => {
      handleAutoComplete(value, false);
    }, 300);
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

  // 关闭所有建议列表
  const closeAllSuggestions = () => {
    setShowOriginSuggestions(false);
    setShowDestinationSuggestions(false);
  };

  // 点击外部关闭建议列表
  useEffect(() => {
    const handleClickOutside = (event) => {
      const controlPanel = document.querySelector('.control-panel');
      if (controlPanel && !controlPanel.contains(event.target)) {
        closeAllSuggestions();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='absolute top-5 left-5 w-[300px] bg-white rounded-md shadow-sm p-3 z-[100] control-panel'>
      {/* 起点输入 */}
      <div className='mb-3 relative'>
        <input
          type='text'
          id='origin'
          placeholder='起点'
          value={origin}
          onChange={handleOriginChange}
          onBlur={() => {
            // 延迟关闭，让点击建议项可以触发
            setTimeout(() => setShowOriginSuggestions(false), 200);
          }}
          onFocus={() => {
            if (originSuggestions.length > 0) {
              setShowOriginSuggestions(true);
            }
          }}
          onKeyDown={(e) => {
            if (!showOriginSuggestions || originSuggestions.length === 0)
              return;

            switch (e.key) {
              case 'ArrowDown':
                e.preventDefault();
                setOriginHighlightIndex((prev) =>
                  prev < originSuggestions.length - 1 ? prev + 1 : 0
                );
                break;
              case 'ArrowUp':
                e.preventDefault();
                setOriginHighlightIndex((prev) =>
                  prev > 0 ? prev - 1 : originSuggestions.length - 1
                );
                break;
              case 'Enter':
                e.preventDefault();
                if (originHighlightIndex >= 0) {
                  handleOriginSuggestionSelect(
                    originSuggestions[originHighlightIndex]
                  );
                } else {
                  setShowOriginSuggestions(false);
                }
                break;
              case 'Escape':
                setShowOriginSuggestions(false);
                break;
              default:
                break;
            }
          }}
          autoComplete='off'
          className='w-full px-2 py-2 border border-blue-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
        />
        {/* 起点建议列表 */}
        {showOriginSuggestions && originSuggestions.length > 0 && (
          <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-blue-200 rounded-md shadow-sm z-[101] max-h-40 overflow-y-auto'>
            {originSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`px-2 py-1.5 text-sm cursor-pointer transition-colors ${
                  index === originHighlightIndex
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'hover:bg-blue-50'
                }`}
                onClick={() => handleOriginSuggestionSelect(suggestion)}
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
          onChange={handleDestinationChange}
          onBlur={() => {
            // 延迟关闭，让点击建议项可以触发
            setTimeout(() => setShowDestinationSuggestions(false), 200);
          }}
          onFocus={() => {
            if (destinationSuggestions.length > 0) {
              setShowDestinationSuggestions(true);
            }
          }}
          onKeyDown={(e) => {
            if (
              !showDestinationSuggestions ||
              destinationSuggestions.length === 0
            )
              return;

            switch (e.key) {
              case 'ArrowDown':
                e.preventDefault();
                setDestinationHighlightIndex((prev) =>
                  prev < destinationSuggestions.length - 1 ? prev + 1 : 0
                );
                break;
              case 'ArrowUp':
                e.preventDefault();
                setDestinationHighlightIndex((prev) =>
                  prev > 0 ? prev - 1 : destinationSuggestions.length - 1
                );
                break;
              case 'Enter':
                e.preventDefault();
                if (destinationHighlightIndex >= 0) {
                  handleDestinationSuggestionSelect(
                    destinationSuggestions[destinationHighlightIndex]
                  );
                } else {
                  setShowDestinationSuggestions(false);
                }
                break;
              case 'Escape':
                setShowDestinationSuggestions(false);
                break;
              default:
                break;
            }
          }}
          autoComplete='off'
          className='w-full px-2 py-2 border border-blue-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
        />
        {/* 终点建议列表 */}
        {showDestinationSuggestions && destinationSuggestions.length > 0 && (
          <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-blue-200 rounded-md shadow-sm z-[101] max-h-40 overflow-y-auto'>
            {destinationSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`px-2 py-1.5 text-sm cursor-pointer transition-colors ${
                  index === destinationHighlightIndex
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'hover:bg-blue-50'
                }`}
                onClick={() => handleDestinationSuggestionSelect(suggestion)}
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
