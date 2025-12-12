import React from 'react';

const FavoriteModal = ({
  showModal,
  setShowModal,
  routeName,
  setRouteName,
  onSave,
}) => {
  if (!showModal) return null;

  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex justify-center items-center z-[2000]'>
      <div className='bg-white rounded-lg shadow-xl p-6 w-[400px] max-w-[90%]'>
        <h3 className='text-lg font-semibold text-primary mb-5 text-center'>
          收藏路线
        </h3>
        <div className='mb-6'>
          <label
            htmlFor='route-name'
            className='block mb-2 text-sm font-medium text-gray-700'
          >
            路线名称
          </label>
          <input
            type='text'
            id='route-name'
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            className='w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300'
            placeholder='请输入路线名称'
          />
        </div>
        <div className='flex justify-end gap-3'>
          <button
            onClick={() => setShowModal(false)}
            className='px-5 py-2.5 bg-white text-gray-600 border border-gray-300 rounded-md text-sm font-medium cursor-pointer transition-all duration-300 hover:bg-gray-50 hover:text-gray-900'
          >
            取消
          </button>
          <button
            onClick={onSave}
            className='px-5 py-2.5 bg-primary text-white border border-primary rounded-md text-sm font-medium cursor-pointer transition-all duration-300 hover:bg-primary/90'
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default FavoriteModal;
