import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径，替代__dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './', // 使用相对路径，允许直接打开index.html
  root: './src', // 设置root为src目录，这样index.html就会输出到构建目录根目录
  build: {
    outDir: '../23050929', // 相对于root的输出目录路径
    emptyOutDir: true, // 清空输出目录
    copyPublicDir: true, // 复制public目录下的文件
    rollupOptions: {
      input: {
        main: resolve(__dirname, './src/index.html'), // 指定入口HTML文件位置
      },
      output: {
        // 确保资源文件输出到assets目录
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  // 配置resolve.alias，方便导入

  // 配置开发服务器
  server: {
    port: 5173,
    open: true,
    proxy: {},
  },
  // 配置预览服务器
  preview: {
    port: 8080,
    open: true,
    // 设置preview的outputDir为字符串类型
    outputDir: resolve(__dirname, '23050929'),
  },
});
