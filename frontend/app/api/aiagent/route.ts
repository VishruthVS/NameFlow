import { NextRequest, NextResponse } from 'next/server';

// Backend API base URL
const API_BASE_URL = 'http://localhost:3000/api';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // Parse the message to determine what the user is asking for
    const lowerMessage = message.toLowerCase();
    let response = '';
    
    // Check if the user is asking for a text record
    if (lowerMessage.includes('text record') || 
        lowerMessage.includes('get text') || 
        lowerMessage.includes('text for') ||
        lowerMessage.includes('com.discord') ||
        lowerMessage.includes('com.twitter') ||
        lowerMessage.includes('email') ||
        lowerMessage.includes('url') ||
        lowerMessage.includes('avatar')) {
      
      // Extract the key from the message
      let key = '';
      
      // Check for common keys
      if (lowerMessage.includes('com.discord')) {
        key = 'com.discord';
      } else if (lowerMessage.includes('com.twitter')) {
        key = 'com.twitter';
      } else if (lowerMessage.includes('email')) {
        key = 'email';
      } else if (lowerMessage.includes('url')) {
        key = 'url';
      } else if (lowerMessage.includes('avatar')) {
        key = 'avatar';
      } else {
        // Try to extract a key from the message
        const keyMatch = message.match(/for\s+([a-zA-Z0-9._]+)/i);
        if (keyMatch && keyMatch[1]) {
          key = keyMatch[1];
        } else {
          return NextResponse.json({
            response: "I couldn't determine which text record you're looking for. Please specify a key like 'com.discord', 'com.twitter', 'email', 'url', or 'avatar'."
          });
        }
      }
      
      // Call the text record API
      const textRecordResponse = await fetch(`${API_BASE_URL}/text-record`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key }),
      });
      
      const textRecordData = await textRecordResponse.json();
      
      if (textRecordData.error) {
        response = `Error getting text record for key "${key}": ${textRecordData.error}`;
      } else {
        response = `Text record for key "${key}": ${textRecordData.value || 'Not found'}`;
      }
    } 
    // Check if the user is asking for the contract owner
    else if (lowerMessage.includes('owner') || lowerMessage.includes('who owns')) {
      const ownerResponse = await fetch(`${API_BASE_URL}/owner`);
      const ownerData = await ownerResponse.json();
      
      if (ownerData.error) {
        response = `Error getting contract owner: ${ownerData.error}`;
      } else {
        response = `Contract owner: ${ownerData.owner}`;
      }
    } 
    // Check if the user is asking for the base node
    else if (lowerMessage.includes('base node') || lowerMessage.includes('basenode')) {
      const baseNodeResponse = await fetch(`${API_BASE_URL}/base-node`);
      const baseNodeData = await baseNodeResponse.json();
      
      if (baseNodeData.error) {
        response = `Error getting base node: ${baseNodeData.error}`;
      } else {
        response = `Base node: ${baseNodeData.baseNode}`;
      }
    } 
    // Check if the user is asking for the symbol
    else if (lowerMessage.includes('symbol')) {
      const symbolResponse = await fetch(`${API_BASE_URL}/symbol`);
      const symbolData = await symbolResponse.json();
      
      if (symbolData.error) {
        response = `Error getting symbol: ${symbolData.error}`;
      } else {
        response = `Symbol: ${symbolData.symbol}`;
      }
    } 
    // Default response for unrecognized queries
    else {
      response = `I'm not sure what you're asking for. You can ask me about:
      
1. Text records (e.g., "Get text record for com.discord")
2. Contract owner (e.g., "Who owns the contract?")
3. Base node (e.g., "What's the base node?")
4. Symbol (e.g., "What's the symbol?")`;
    }
    
    return NextResponse.json({ response });
    
  } catch (error) {
    console.error('Error processing AI agent request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 