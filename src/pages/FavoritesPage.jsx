import React, { useState, useEffect } from 'react';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editNote, setEditNote] = useState('');

  // 从localStorage加载收藏的路线
  useEffect(() => {
    const loadFavorites = () => {
      const storedFavorites = localStorage.getItem('routePlanning_favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    };

    loadFavorites();
  }, []);

  // 删除收藏的路线
  const handleDelete = (id) => {
    const updatedFavorites = favorites.filter((route) => route.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem(
      'routePlanning_favorites',
      JSON.stringify(updatedFavorites)
    );
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

  return (
    <div className='p-5 bg-gray-100 min-h-[calc(100vh-64px)]'>
      <div className='max-w-7xl mx-auto px-5'>
        <h1 className='text-2xl font-semibold text-primary mb-5 text-center'>
          收藏路线
        </h1>

        {favorites.length === 0 ? (
          <div className='text-center p-15 bg-white rounded-lg shadow-md text-gray-600'>
            <p className='text-base'>暂无收藏的路线</p>
            <p className='text-base'>您可以在首页规划路线后收藏喜欢的路线</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {favorites.map((route) => (
              <div
                key={route.id}
                className='bg-white rounded-lg shadow-md p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
              >
                {editingId === route.id ? (
                  // 编辑模式
                  <div>
                    <div className='mb-4'>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        路线名称
                      </label>
                      <input
                        type='text'
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300'
                        placeholder='请输入路线名称'
                      />
                    </div>
                    <div className='mb-4'>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        备注
                      </label>
                      <textarea
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 resize-y h-20'
                        placeholder='请输入备注信息（可选）'
                      />
                    </div>
                    <div className='flex justify-end gap-2'>
                      <button
                        className='bg-gray-200 text-gray-800 border border-gray-300 px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-all duration-300 hover:bg-gray-300'
                        onClick={handleCancelEdit}
                      >
                        取消
                      </button>
                      <button
                        className='bg-primary text-white border border-primary px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-all duration-300 hover:bg-primary/90'
                        onClick={handleSaveEdit}
                      >
                        保存
                      </button>
                    </div>
                  </div>
                ) : (
                  // 查看模式
                  <>
                    <div className='flex justify-between items-center mb-4'>
                      <h3 className='text-lg font-semibold text-primary'>
                        {route.name}
                      </h3>
                      <div className='flex gap-2'>
                        <button
                          className='bg-blue-500 text-white border border-blue-500 px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-all duration-300 hover:bg-blue-600'
                          onClick={() => handleEdit(route)}
                        >
                          编辑
                        </button>
                        <button
                          className='bg-red-500 text-white border border-red-500 px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-all duration-300 hover:bg-red-600'
                          onClick={() => handleDelete(route.id)}
                        >
                          删除
                        </button>
                      </div>
                    </div>
                    <div className='text-sm'>
                      <div className='flex justify-between mb-2'>
                        <span className='text-gray-600 font-medium'>
                          起点：
                        </span>
                        <span className='text-gray-900 font-semibold'>
                          {route.origin}
                        </span>
                      </div>
                      <div className='flex justify-between mb-2'>
                        <span className='text-gray-600 font-medium'>
                          终点：
                        </span>
                        <span className='text-gray-900 font-semibold'>
                          {route.destination}
                        </span>
                      </div>
                      <div className='flex justify-between mb-2'>
                        <span className='text-gray-600 font-medium'>
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
                      <div className='flex justify-between mb-2'>
                        <span className='text-gray-600 font-medium'>
                          距离：
                        </span>
                        <span className='text-gray-900 font-semibold'>
                          {route.distance}
                        </span>
                      </div>
                      <div className='flex justify-between mb-2'>
                        <span className='text-gray-600 font-medium'>
                          时间：
                        </span>
                        <span className='text-gray-900 font-semibold'>
                          {route.duration}
                        </span>
                      </div>
                      {route.note && (
                        <div className='mb-2'>
                          <span className='text-gray-600 font-medium'>
                            备注：
                          </span>
                          <div className='mt-1 text-gray-900 font-semibold bg-gray-50 p-2 rounded'>
                            {route.note}
                          </div>
                        </div>
                      )}
                      <div className='flex justify-between'>
                        <span className='text-gray-600 font-medium'>
                          创建时间：
                        </span>
                        <span className='text-gray-900 font-semibold'>
                          {new Date(route.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {route.updatedAt && (
                        <div className='flex justify-between mt-1'>
                          <span className='text-gray-600 font-medium'>
                            更新时间：
                          </span>
                          <span className='text-gray-900 font-semibold text-xs'>
                            {new Date(route.updatedAt).toLocaleString()}
                          </span>
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
  );
};

export default FavoritesPage;
