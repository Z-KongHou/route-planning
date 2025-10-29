export default function Footer() {
  return (
    <div className='bg-muted text-muted-foreground border-t border-border'>
      <div className='px-6 py-4'>
        <div className='flex justify-between items-center'>
          <p className='text-sm'>© 2025 杭州房源查询. All rights reserved.</p>
          <div className='flex gap-6 text-sm'>
            <a href='#' className='hover:text-foreground transition-colors'>
              关于我们
            </a>
            <a href='#' className='hover:text-foreground transition-colors'>
              联系我们
            </a>
            <a href='#' className='hover:text-foreground transition-colors'>
              隐私政策
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
