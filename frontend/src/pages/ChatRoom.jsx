import React, { useState, useRef, useEffect } from 'react';
import { Search, SendHorizonal } from 'lucide-react';
import reactLogo from '../assets/react.svg';

export default function ChatRoom() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Simon', text: 'Hi there!', timestamp: new Date() },
    { id: 2, sender: 'You', text: 'Hello!', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const messageContainerRef = useRef(null);

  const handleSend = () => {
    if (input.trim() === '') return;
    const newMessage = {
      id: Date.now(),
      sender: 'You',
      text: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // Scroll to bottom on new message
  useEffect(() => {
    const container = messageContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <div className='pt-15 h-screen grid grid-cols-1 md:grid-cols-3 overflow-hidden'>

      {/* Sidebar */}
      <div className='hidden md:flex flex-col p-4 border-r md:col-span-1 bg-white'>
        <div className='relative mb-4'>
          <input
            type='search'
            placeholder='Search chats...'
            className='w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm'
          />
          <Search size={20} className='absolute right-3 top-2.5 text-gray-500' />
        </div>
        <div className='flex items-center gap-2 py-2 px-2 hover:bg-gray-200 rounded-lg cursor-pointer'>
          <img src={reactLogo} alt='User' className='h-10 w-10 rounded-full' />
          <span>Simon Lamacy</span>
        </div>
      </div>

      {/* Chat Panel */}
      <div className='flex flex-col md:col-span-2 bg-gray-100 h-screen'>

        {/* Header */}
        <div className='flex items-center gap-2 border-b p-4 bg-white shadow-md'>
          <img src={reactLogo} alt='React Logo' className='h-12 w-12 rounded-full' />
          <h3 className='text-lg font-semibold'>Simon Lamacy</h3>
        </div>

        {/* Chat messages - 80% of screen height */}
        <div className='flex-1 overflow-y-auto px-4 py-2 mb-17 space-y-2' ref={messageContainerRef} style={{ maxHeight: 'calc(100vh - 220px)' }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg max-w-xs ${
                msg.sender === 'You'
                  ? 'bg-indigo-500 text-white self-end ml-auto'
                  : 'bg-white text-black self-start'
              }`}
            >
              <p>{msg.text}</p>
              <span className='text-xs block mt-1 opacity-60'>{msg.timestamp.toLocaleTimeString()}</span>
            </div>
          ))}
        </div>

        {/* Fixed Input Box */}
        <div className='sticky bottom-0 bg-white border-t p-2 flex items-center'>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Type a message...'
            className='flex-1 rounded-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm'
          />
          <button onClick={handleSend} className='ml-2 p-2 bg-indigo-500 rounded-full hover:bg-indigo-600 text-white'>
            <SendHorizonal size={20} />
          </button>
        </div>

      </div>
    </div>
  );
}
