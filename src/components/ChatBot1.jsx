// src/components/ChatBot.jsx
import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaChurch, FaPrayingHands, FaBible, FaCalendarAlt } from 'react-icons/fa';
import logo from '../assets/emlr/logo1.png';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Sample knowledge base for the church
  const knowledgeBase = {
    "salvation": {
      response: "Salvation comes through faith in Jesus Christ (John 3:16). We'd love to guide you through accepting Christ as your Savior. Would you like prayer or more information about this?",
      icon: <FaPrayingHands className="text-[#d34930] mr-2" />
    },
    "services": {
      response: "Our worship services are: Sunday Morning - 9:00 AM, Sunday Evening - 6:00 PM, Wednesday Bible Study - 7:00 PM. We also have special prayer meetings every Friday at noon.",
      icon: <FaChurch className="text-green-500 mr-2" />
    },
    "bible": {
      response: "We recommend starting with the Gospel of John to learn about Jesus. Our current sermon series is on the Book of Romans. Would you like Bible study resources?",
      icon: <FaBible className="text-yellow-500 mr-2" />
    },
    "events": {
      response: "Upcoming events: Vacation Bible School - June 15-19, Men's Retreat - July 10-12, Women's Conference - August 7-8. Check our bulletin for details!",
      icon: <FaCalendarAlt className="text-purple-500 mr-2" />
    },
    "default": {
      response: "I'm here to help with questions about faith, services, Bible study, and church events. How may I serve you today?",
      icon: <FaChurch className="text-purple-500 mr-2" />
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = { text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate typing indicator
    setMessages(prev => [...prev, { text: '...', sender: 'bot', typing: true }]);

    // Bot response after delay
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => !msg.typing));
      
      const lowerInput = inputValue.toLowerCase();
      let responseKey = 'default';
      
      if (lowerInput.includes('saved') || lowerInput.includes('salvation') || lowerInput.includes('christ')) {
        responseKey = 'salvation';
      } else if (lowerInput.includes('service') || lowerInput.includes('worship') || lowerInput.includes('mass')) {
        responseKey = 'services';
      } else if (lowerInput.includes('bible') || lowerInput.includes('scripture') || lowerInput.includes('study')) {
        responseKey = 'bible';
      } else if (lowerInput.includes('event') || lowerInput.includes('meeting') || lowerInput.includes('when')) {
        responseKey = 'events';
      }

      const botResponse = {
        text: knowledgeBase[responseKey].response,
        sender: 'bot',
        icon: knowledgeBase[responseKey].icon
      };
      
      setMessages(prev => [...prev, botResponse]);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "How can I be saved?",
    "What time are your services?",
    "Where should I start reading the Bible?",
    "What church events are coming up?"
  ];

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-[#001d3a] hover:bg-[#290011] text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-all duration-300 z-40"
        aria-label="Open chat"
      >
        <FaRobot className="text-2xl" />
        {!isOpen && (
          <span className="absolute -top-2 -right-2 bg-[#feed17] text-[#290011] text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
            AI
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 w-96 max-w-full bg-white rounded-lg shadow-xl flex flex-col z-50 border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-[#290011] text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
              <FaRobot className="text-xl mr-2" />
              <h3 className="font-semibold">EMLR Spiritual Assistant</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-[#feed17] transition-colors"
              aria-label="Close chat"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50" style={{ maxHeight: '60vh' }}>
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <FaRobot className="text-4xl mx-auto text-gray-300 mb-2" />
                <p>Peace be with you! I'm here to help with spiritual questions and church information.</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${msg.sender === 'user' 
                      ? 'bg-[#290011] text-white rounded-br-none' 
                      : 'bg-white border border-gray-200 rounded-bl-none'}`}
                  >
                    {msg.sender === 'bot' && msg.icon && (
                      <div className="flex items-center mb-1">
                        {msg.icon}
                        <span className="font-semibold text-sm">Spiritual Assistant</span>
                      </div>
                    )}
                    {msg.typing ? (
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    ) : (
                      <p>{msg.text}</p>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 0 && (
            <div className="px-4 pb-2">
              <h4 className="text-xs text-gray-500 uppercase font-semibold mb-2">Try asking:</h4>
              <div className="grid grid-cols-1 gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(question)}
                    className="text-left text-sm bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about faith, services, Bible..."
                className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className={`bg-[#290011] text-white px-4 py-2 rounded-r-lg ${!inputValue.trim() ? 'opacity-50' : 'hover:bg-[#002244]'}`}
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;