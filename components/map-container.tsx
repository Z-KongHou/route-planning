'use client';

import { useEffect, useState } from 'react';

const key = process.env.NEXT_PUBLIC_AMAP_KEY;

export default function MapContainer({
  width,
  height,
}: {
  width: string;
  height: string;
}) {
  /* 1. 用 null 而不是 ''，彻底避免空字符串 src 警告 */
  const [mapUrl, setMapUrl] = useState<string | null>(null);

  useEffect(() => {
    /* 2. 拼出静态地图 URL 即可，无需 fetch 图片二进制 */
    const url = `https://restapi.amap.com/v3/staticmap?key=${key}&location=30.14,120.8&zoom=15&size=1024*1024`;
    setMapUrl(url);

    /* 可选：组件卸载时清掉，防止重复请求 */
    return () => setMapUrl(null);
  }, [width, height]);

  return (
    <div className='flex-1 bg-muted overflow-hidden'>
      <div id='amap-container' className='w-full h-full'>
        {/* 3. 条件渲染，url 为 null 时不渲染 img */}
        {mapUrl && (
          <img
            src={mapUrl}
            alt='static map'
            className='w-full h-full object-cover'
          />
        )}
      </div>
    </div>
  );
}
