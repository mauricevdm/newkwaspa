'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  X, 
  Sparkles,
  User,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hi! I'm Derma, your AI skincare assistant. I can help you with skincare advice, product recommendations, and answer any questions about your routine. How can I help you today?",
    timestamp: new Date(),
  },
];

const quickReplies = [
  "What's good for oily skin?",
  "Help me build a routine",
  "Recommend a moisturizer",
  "Explain retinol",
];

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));

    const responses: Record<string, string> = {
      "oily": "For oily skin, I recommend:\n\n1. **Cleanser**: Gel-based cleansers with salicylic acid\n2. **Toner**: Niacinamide-based toners\n3. **Moisturizer**: Lightweight, oil-free gel moisturizers\n4. **SPF**: Mattifying sunscreens\n\nWould you like specific product recommendations from our catalog?",
      "routine": "I'd be happy to help build your routine! To give you personalized advice, I need to know:\n\n1. What's your skin type?\n2. Any specific concerns (acne, aging, pigmentation)?\n3. What products are you currently using?\n\nAlternatively, try our **AI Skin Analysis** tool for a detailed assessment!",
      "moisturizer": "Here are some great moisturizer options:\n\n**For Dry Skin:**\n• Environ AVST Moisturiser - R1,600\n• Lamelle Serra Cream - R899\n\n**For Oily Skin:**\n• Heliocare Gel - R450\n• La Roche-Posay Effaclar Mat - R399\n\nWant me to tell you more about any of these?",
      "retinol": "**Retinol** is a form of Vitamin A and one of the most effective anti-aging ingredients!\n\n**Benefits:**\n• Reduces fine lines & wrinkles\n• Improves skin texture\n• Helps with acne\n• Evens skin tone\n\n**Tips:**\n• Start slow (2-3x/week)\n• Always use SPF\n• Apply at night\n• Use a pea-sized amount\n\nShall I recommend some retinol products?",
    };

    let responseContent = "That's a great question! Based on your skincare needs, I'd recommend exploring our personalized skin analysis tool for tailored recommendations. Is there anything specific you'd like to know about skincare ingredients or routines?";

    for (const [key, value] of Object.entries(responses)) {
      if (content.toLowerCase().includes(key)) {
        responseContent = value;
        break;
      }
    }

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseContent,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-full shadow-lg flex items-center justify-center z-50 hover:shadow-xl transition-shadow"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        height: isMinimized ? '60px' : 'auto'
      }}
      className="fixed bottom-6 right-6 w-[380px] bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Derma AI</h3>
            <p className="text-xs text-teal-100">Your skincare assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMinimized ? (
              <Maximize2 className="w-5 h-5 text-white" />
            ) : (
              <Minimize2 className="w-5 h-5 text-white" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-[350px] overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    message.role === 'user'
                      ? 'bg-teal-600 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100" />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200" />
                </div>
                <span className="text-sm">Derma is typing...</span>
              </div>
            )}
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full hover:bg-teal-100 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex items-center gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about skincare..."
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <p className="text-xs text-gray-400 text-center mt-2">
              Powered by AI • Not medical advice
            </p>
          </div>
        </>
      )}
    </motion.div>
  );
}

export default AIChatbot;
