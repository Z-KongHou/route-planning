import Header from '@/components/header';
import Footer from '@/components/footer';
import MapContainer from '@/components/map-container';

export default function Home() {
  return (
    <div className='flex flex-col min-h-screen bg-background'>
      {/* Header */}
      <Header />

      {/* Body - 三栏结构 */}
      <div className='flex flex-1 overflow-hidden'>
        {/* 中间地图区域 */}
        <MapContainer width='100%' height='100%' />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
