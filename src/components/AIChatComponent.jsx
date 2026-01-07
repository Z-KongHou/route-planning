import React, { useState, useRef, useEffect } from 'react';

const AIChatComponent = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '你好！我是AI助手，有什么可以帮助你的吗？',
      isAI: true,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [conversationId, setConversationId] = useState(''); // 添加会话ID状态，支持连续对话
  const [isLoading, setIsLoading] = useState(false); // 添加loading状态
  const messagesEndRef = useRef(null); // 用于自动滚动到底部
  const abortControllerRef = useRef(null); // 用于取消流式请求

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 监听消息变化，自动滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (inputText.trim()) {
      // 保存当前输入，防止后续状态变化
      const currentInput = inputText.trim();
      setInputText('');

      try {
        // 取消之前的请求（如果存在）
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        // 添加用户消息 - 使用函数式更新获取最新状态
        const userMessage = {
          id: Date.now(),
          text: currentInput,
          isAI: false,
        };

        // 添加AI消息占位符
        const aiMessageId = Date.now() + 1;
        const initialAiMessage = {
          id: aiMessageId,
          text: '',
          isAI: true,
        };

        setMessages((prevMessages) => [
          ...prevMessages,
          userMessage,
          initialAiMessage,
        ]);
        setIsLoading(true);

        // 调用Dify API获取回复 - 流式模式
        const API_KEY = 'app-KDvVPoiGMSKuoZnorgpawK6l';
        const BASE_URL = 'https://api.dify.ai/v1/chat-messages';
        // 使用固定用户ID，确保会话连续性
        const userId = 'route_planning_user';

        const response = await fetch(BASE_URL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: {}, // 如果工作流有变量输入，填在这里
            query: currentInput, // 用户在前端输入的文字
            response_mode: 'streaming', // 使用流式模式
            user: userId, // 用户的唯一标识，用于区分会话
            conversation_id: conversationId, // 如果是连续对话，传入之前获取的ID
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`API请求失败: ${response.status}`);
        }

        // 处理流式响应
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedData = '';
        let currentAnswer = '';
        let hasReceivedData = false;

        console.log('开始处理流式响应');

        // 实时更新AI回复
        const updateAiMessage = (text) => {
          console.log('更新AI消息:', text.length, '字符');
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === aiMessageId ? { ...msg, text } : msg
            )
          );
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log('流式响应结束');
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          accumulatedData += chunk;
          console.log('收到数据块:', chunk.length, '字符');

          // 按行分割数据
          const lines = accumulatedData.split('\n');
          accumulatedData = lines.pop(); // 保存未完整的行

          for (const line of lines) {
            if (line.trim() === '') continue;

            // 移除 'data: ' 前缀
            const dataPrefix = 'data: ';
            if (line.startsWith(dataPrefix)) {
              const dataLine = line.slice(dataPrefix.length);
              if (dataLine === '[DONE]') {
                // 结束标记
                console.log('收到结束标记');
                setIsLoading(false);
                return;
              }

              try {
                const data = JSON.parse(dataLine);
                console.log('解析后的数据:', JSON.stringify(data, null, 2));

                // 检查返回的数据结构
                if (data && typeof data === 'object') {
                  hasReceivedData = true;

                  // 关键修改：实现真正的增量输出
                  let newContent = '';

                  // 格式1: 检查是否为增量数据（常见于SSE响应）
                  if (data.choices && data.choices.length > 0) {
                    const choice = data.choices[0];
                    if (choice.delta && choice.delta.content) {
                      newContent = choice.delta.content;
                    }
                  }
                  // 格式2: delta增量字段（类似OpenAI API）
                  else if (data.delta && data.delta.content) {
                    newContent = data.delta.content;
                  }
                  // 格式3: 直接content字段
                  else if (data.content) {
                    newContent = data.content;
                  }
                  // 格式4: text字段
                  else if (data.text) {
                    newContent = data.text;
                  }
                  // 格式5: Dify API的特殊处理 - 提取新增内容
                  else if (data.answer !== undefined) {
                    // Dify API可能每次返回完整answer，我们需要提取新增部分
                    if (currentAnswer === '') {
                      // 第一次收到answer，直接使用
                      newContent = data.answer;
                    } else if (data.answer.startsWith(currentAnswer)) {
                      // 后续收到的answer是完整内容，提取新增部分
                      newContent = data.answer.slice(currentAnswer.length);
                    } else {
                      // 不匹配，可能是新的回复，直接替换
                      newContent = data.answer;
                    }
                  }

                  // 如果有新增内容，追加到当前答案
                  if (newContent) {
                    console.log('新增内容:', JSON.stringify(newContent));
                    currentAnswer += newContent;
                    updateAiMessage(currentAnswer);
                  }

                  // 保存会话ID
                  if (data.conversation_id) {
                    console.log('更新会话ID:', data.conversation_id);
                    setConversationId(data.conversation_id);
                  }
                }
              } catch (e) {
                console.error('解析流式数据失败:', e);
                console.error('原始数据行:', line);
              }
            }
          }
        }

        // 最终更新
        if (hasReceivedData) {
          console.log('最终AI回复:', currentAnswer);
          updateAiMessage(currentAnswer);
        } else {
          console.log('未收到有效数据，显示错误信息');
          updateAiMessage('抱歉，AI回复失败，请稍后重试。');
        }
        setIsLoading(false);
        console.log('流式处理完成');
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('请求已取消');
        } else {
          console.error('调用 Dify 出错:', error);
          // 更新错误消息
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.isAI && msg.text === ''
                ? { ...msg, text: '抱歉，AI回复失败，请稍后重试。' }
                : msg
            )
          );
        }
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* 右下角圆形按钮 */}
      <div
        className='fixed bottom-5 right-5 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold cursor-pointer shadow-lg hover:bg-blue-700 transition-colors'
        onClick={() => setShowChat(true)}
      >
        chat
      </div>
      {/* 聊天模态框 */}
      <div
        className={`fixed inset-0 flex items-end justify-end z-50 transition-all duration-300 ${
          showChat ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* 背景层 - 全透明 */}
        <div
          className='fixed inset-0 bg-transparent'
          onClick={() => setShowChat(false)}
        ></div>
        {/* 聊天框 - 添加动画效果 */}
        <div
          className={`bg-white rounded-t-lg w-full max-w-md flex flex-col m-4 transition-all duration-300 transform ${
            showChat
              ? 'h-[70vh] scale-100 opacity-100'
              : 'h-16 scale-0 opacity-0 origin-bottom-right'
          }`}
        >
          {/* 模态框头部 */}
          <div className='flex items-center justify-between p-4 border-b'>
            <h3 className='text-lg font-semibold'>AI 助手</h3>
            <button
              className='text-gray-500 hover:text-gray-700'
              onClick={() => setShowChat(false)}
            >
              ✕
            </button>
          </div>

          {/* 聊天消息区域 */}
          <div className='flex-1 p-4 overflow-y-auto space-y-4'>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isAI ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isAI
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {/* 加载指示器 */}
            {isLoading && (
              <div className='flex justify-start'>
                <div className='max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-800'>
                  <div className='flex items-center space-x-1'>
                    <span className='animate-bounce'>•</span>
                    <span className='animate-bounce animation-delay-200'>
                      •
                    </span>
                    <span className='animate-bounce animation-delay-400'>
                      •
                    </span>
                  </div>
                </div>
              </div>
            )}
            {/* 用于自动滚动的ref */}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <div className='p-4 border-t flex'>
            <input
              type='text'
              className='flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='输入消息...'
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button
              className='bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed'
              onClick={handleSend}
              disabled={isLoading}
            >
              {isLoading ? '发送中...' : '发送'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChatComponent;
