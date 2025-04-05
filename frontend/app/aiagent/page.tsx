'use client';

import { useState } from 'react';

// Define a type for conversation messages
type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
};

export default function AIAgentPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) {
      setError('Please enter a message');
      return;
    }
    
    // Add user message to conversation
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/aiagent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.content }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to get response');
      }
      
      const data = await res.json();
      
      // Add assistant message to conversation
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to format long values like base node addresses
  const formatLongValue = (content: string) => {
    // Check if the content contains a base node or similar long hex value
    if (content.includes('0x') && content.length > 50) {
      // Split the content into parts
      const parts = content.split(':');
      if (parts.length >= 2) {
        const label = parts[0];
        const value = parts.slice(1).join(':').trim();
        
        // Format the value with word breaks
        const formattedValue = value.replace(/(0x[a-fA-F0-9]{8})/g, '$1 ');
        
        return (
          <>
            <div className="font-medium">{label}:</div>
            <div className="break-all font-mono text-sm mt-1">{formattedValue}</div>
          </>
        );
      }
    }
    
    // For regular content, just return it with proper wrapping
    return <div className="whitespace-pre-wrap break-words">{content}</div>;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">AI Agent</h1>
      
      <div className="bg-indigo-50 p-4 rounded-md border border-indigo-200 mb-6">
        <h2 className="text-lg font-medium mb-2">How to use this AI Agent</h2>
        <p className="mb-2">You can ask the AI Agent about:</p>
        <ul className="list-disc pl-5 mb-2 space-y-1">
          <li>Text records (e.g., &quot;Get text record for com.discord&quot;)</li>
          <li>Contract owner (e.g., &quot;Who owns the contract?&quot;)</li>
          <li>Base node (e.g., &quot;What&apos;s the base node?&quot;)</li>
          <li>Symbol (e.g., &quot;What&apos;s the symbol?&quot;)</li>
        </ul>
        <p className="text-sm text-gray-600">Note: The backend API server is running at https://ethglobal-taipei-4xxj9.ondigitalocean.app</p>
      </div>
      
      <div className="bg-gray-100 rounded-md border border-gray-300 mb-6 h-96 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 h-full flex items-center justify-center">
            <p>Start a conversation by typing a message below</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-md ${
                  message.role === 'user' 
                    ? 'bg-indigo-600 text-white ml-auto max-w-[80%]' 
                    : 'bg-gray-200 text-gray-800 border border-gray-300 mr-auto max-w-[80%]'
                }`}
              >
                <div className="font-medium mb-1">
                  {message.role === 'user' ? 'You' : 'AI Agent'}
                </div>
                {message.role === 'user' ? (
                  <div className="whitespace-pre-wrap break-words">{message.content}</div>
                ) : (
                  formatLongValue(message.content)
                )}
                <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-indigo-200' : 'text-gray-500'}`}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            Enter your message
          </label>
          <textarea
            id="message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
            placeholder="Type your message here..."
          />
        </div>
        
        {error && (
          <div className="mb-4 text-red-500 text-sm">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
} 