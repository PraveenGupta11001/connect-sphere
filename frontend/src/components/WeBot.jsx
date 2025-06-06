import React, { useState, useEffect, useRef } from 'react';

export default function WeBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const chatContainerRef = useRef(null);
  const [conversationHistory, setConversationHistory] = useState([]);

  // Backend URL (HTTPS)
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://we-connect-nifx.onrender.com';

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user message as 'Me'
    const userMessage = {
      sender: 'Me',
      text: userInput,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_input: userInput,
          max_tokens: 1024,
          temperature: 0.9,
          conversation_history: conversationHistory,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let responseText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((line) => line.trim());
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.response) {
              responseText += data.response;
            } else if (data.updated_history) {
              setConversationHistory(data.updated_history);
            }
          } catch (error) {
            console.error('Error parsing chunk:', error);
          }
        }
      }

      // Add WeBot message after streaming completes
      if (responseText) {
        const botMessage = {
          sender: 'WeBot',
          text: responseText,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error('Empty response from API');
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'WeBot',
          text: 'Oops, something went wrong. Please try again!',
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleVoiceInput = () => {
    if (!window.isSecureContext) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'WeBot',
          text: 'Voice input requires a secure connection (HTTPS). Please enable HTTPS or use text input.',
          timestamp: new Date().toISOString(),
        },
      ]);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'WeBot',
          text: 'Voice input is not supported in this browser. Please use Chrome or Edge.',
          timestamp: new Date().toISOString(),
        },
      ]);
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'WeBot',
          text: 'Microphone access is not supported in this browser.',
          timestamp: new Date().toISOString(),
        },
      ]);
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsRecording(true);

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setUserInput(transcript);
          setIsRecording(false);
          handleSendMessage({ preventDefault: () => {} });
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
          let errorMessage = 'Oops, couldn’t hear you. Try again!';
          if (event.error === 'not-allowed') {
            errorMessage = 'Microphone access is blocked. Please allow microphone access.';
          } else if (event.error === 'no-speech') {
            errorMessage = 'No speech detected. Please speak clearly.';
          }
          setMessages((prev) => [
            ...prev,
            {
              sender: 'WeBot',
              text: errorMessage,
              timestamp: new Date().toISOString(),
            },
          ]);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        try {
          recognition.start();
        } catch (error) {
          console.error('Error starting recognition:', error);
          setIsRecording(false);
          setMessages((prev) => [
            ...prev,
            {
              sender: 'WeBot',
              text: 'Failed to start voice input. Please check your microphone.',
              timestamp: new Date().toISOString(),
            },
          ]);
        }
      })
      .catch((error) => {
        console.error('Microphone access error:', error);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'WeBot',
            text: 'Microphone access is blocked. Please allow microphone access.',
            timestamp: new Date().toISOString(),
          },
        ]);
      });
  };

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50">
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          id="we-bot-button"
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Open WeBot"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            ></path>
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-xl w-[95vw] max-w-md sm:w-[28rem] h-[32rem] sm:h-[36rem] flex flex-col transform transition-all duration-300 animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-2xl p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                ></path>
              </svg>
              <h2 className="text-lg font-bold">WeBot</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 focus:outline-none"
              aria-label="Close WeBot"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          {/* Chat Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3 chat-container"
          >
            {messages.length === 0 ? (
              <div className="text-gray-500 text-center italic text-sm">
                Ask me anything to get started!
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === 'Me' ? 'justify-end' : 'justify-start'
                  } animate-fade-in`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-xl text-sm ${
                      msg.sender === 'Me'
                        ? 'bg-indigo-500 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="font-semibold">{msg.sender}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="mt-1">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 p-3 rounded-xl rounded-bl-none shadow-md text-sm">
                  <span className="typing-dots">
                    Typing<span>.</span><span>.</span><span>.</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white rounded-b-2xl">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything..."
                className="flex-1 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm h-10"
                rows="1"
              />
              <button
                type="submit"
                disabled={isLoading || isRecording}
                className={`bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  isLoading || isRecording ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                aria-label="Send message"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  ></path>
                </svg>
              </button>
              <button
                type="button"
                onClick={handleVoiceInput}
                disabled={isLoading || isRecording}
                className={`p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                } ${isLoading || isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label="Voice input"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  ></path>
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
