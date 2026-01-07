import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// 直接导入markdown文件内容
import userManual from '../../public/docs/用户手册.md?raw';
import developmentGuide from '../../public/docs/开发指南.md?raw';
import systemArchitecture from '../../public/docs/系统架构.md?raw';
import homepageRequirements from '../../public/docs/首页需求说明.md?raw';
import aboutpageRequirements from '../../public/docs/关于页需求说明.md?raw';
import favoritespageRequirements from '../../public/docs/收藏页需求说明.md?raw';

// 文档内容映射
const DOCS_CONTENT = {
  'user-manual': userManual,
  'development-guide': developmentGuide,
  'system-architecture': systemArchitecture,
  'homepage-requirements': homepageRequirements,
  'aboutpage-requirements': aboutpageRequirements,
  'favoritespage-requirements': favoritespageRequirements,
};

// 文档列表
const DOCS_LIST = [
  { id: 'user-manual', name: '用户手册' },
  { id: 'development-guide', name: '开发指南' },
  { id: 'system-architecture', name: '系统架构' },
  { id: 'homepage-requirements', name: '首页需求说明' },
  { id: 'aboutpage-requirements', name: '关于页需求说明' },
  { id: 'favoritespage-requirements', name: '收藏页需求说明' },
];

const DocsPage = () => {
  const [selectedDoc, setSelectedDoc] = useState(DOCS_LIST[0]);
  const [markdownContent, setMarkdownContent] = useState(
    DOCS_CONTENT[selectedDoc.id]
  );

  // 切换文档时更新内容
  const handleDocChange = (doc) => {
    setSelectedDoc(doc);
    setMarkdownContent(DOCS_CONTENT[doc.id]);
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div
        className='flex flex-col md:flex-row gap-6'
        style={{ height: 'calc(100vh - 120px)' }}
      >
        {/* 文档侧边栏 - 固定定位 */}
        <aside className='md:w-1/4 bg-white rounded-lg shadow-md p-4 sticky top-4 h-fit'>
          <h2 className='text-xl font-bold mb-4 text-primary'>文档列表</h2>
          <nav className='space-y-2'>
            {DOCS_LIST.map((doc) => (
              <button
                key={doc.id}
                onClick={() => handleDocChange(doc)}
                className={`w-full text-left px-4 py-2 rounded-md transition-all duration-200 ${
                  selectedDoc.id === doc.id
                    ? 'bg-primary text-white font-medium'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {doc.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* 文档内容区域 - 滚动 */}
        <main className='md:w-3/4 bg-white rounded-lg shadow-md p-6 overflow-y-auto max-h-full'>
          <div className='mb-4 flex'>
            <h1 className='text-2xl font-bold text-primary'>
              {selectedDoc.name}
            </h1>
          </div>

          <div className='prose max-w-none'>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag='div'
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {markdownContent}
            </ReactMarkdown>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocsPage;
