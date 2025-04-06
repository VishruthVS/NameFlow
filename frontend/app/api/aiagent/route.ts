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
    
    // Check if the user is asking for name availability
    if (lowerMessage.includes('available') || lowerMessage.includes('check if') || lowerMessage.includes('is available')) {
      // Extract the name from the message - improved regex pattern
      const nameMatch = lowerMessage.match(/(?:available|check if|is available)\s+(?:the name\s+)?["']?([a-zA-Z0-9]+)["']?/i);
      if (nameMatch && nameMatch[1]) {
        const name = nameMatch[1];
        const availableResponse = await fetch(`${API_BASE_URL}/available`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ label: name })
        });
        const availableData = await availableResponse.json();
        
        if (availableData.error) {
          response = `Error checking availability: ${availableData.error}`;
        } else {
          response = `The name "${name}" is ${availableData.available ? 'available' : 'not available'} for registration.`;
        }
      } else {
        // Try an alternative pattern for "is the name X available"
        const altNameMatch = lowerMessage.match(/is\s+(?:the name\s+)?["']?([a-zA-Z0-9]+)["']?\s+available/i);
        if (altNameMatch && altNameMatch[1]) {
          const name = altNameMatch[1];
          const availableResponse = await fetch(`${API_BASE_URL}/available`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ label: name })
          });
          const availableData = await availableResponse.json();
          
          if (availableData.error) {
            response = `Error checking availability: ${availableData.error}`;
          } else {
            response = `The name "${name}" is ${availableData.available ? 'available' : 'not available'} for registration.`;
          }
        } else {
          response = 'Please specify a name to check availability.';
        }
      }
    }
    // Check if the user wants to register a name
    else if (lowerMessage.includes('register') || lowerMessage.includes('register the name')) {
      // Extract the name from the message
      const nameMatch = lowerMessage.match(/(?:register|register the name)\s+["']?([a-zA-Z0-9]+)["']?/);
      if (nameMatch && nameMatch[1]) {
        const name = nameMatch[1];
        // First check if the name is available
        const availableResponse = await fetch(`${API_BASE_URL}/available`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ label: name })
        });
        const availableData = await availableResponse.json();
        
        if (availableData.error) {
          response = `Error checking availability: ${availableData.error}`;
        } else if (!availableData.available) {
          response = `The name "${name}" is not available for registration.`;
        } else {
          // If available, proceed with registration
          const registerResponse = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              label: name,
              owner: '0x657Ec760F0689119DB61155bCa25cfAc5E286Dba' // Default owner for testing
            })
          });
          const registerData = await registerResponse.json();
          
          if (registerData.error) {
            response = `Error registering name: ${registerData.error}`;
          } else {
            response = `Successfully registered the name "${name}"!\n\nDetails:\n- Contract Address: ${registerData.contractAddress}\n- Owner: ${registerData.owner}\n- Transaction Hash: ${registerData.transactionHash}\n- Timestamp: ${registerData.timestamp}`;
          }
        }
      } else {
        response = 'Please specify a name to register.';
      }
    }
    // Check if the user is asking for text records
    else if (lowerMessage.includes('text record') || lowerMessage.includes('get text record')) {
      // Extract the key from the message
      const keyMatch = lowerMessage.match(/(?:text record|get text record)\s+(?:for\s+)?["']?([a-zA-Z0-9.]+)["']?/);
      if (keyMatch && keyMatch[1]) {
        const key = keyMatch[1];
        const textRecordResponse = await fetch(`${API_BASE_URL}/text-record`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key })
        });
        const textRecordData = await textRecordResponse.json();
        
        if (textRecordData.error) {
          response = `Error getting text record: ${textRecordData.error}`;
        } else {
          response = `Text record for "${key}": ${textRecordData.value}`;
        }
      } else {
        response = 'Please specify a key to get the text record for.';
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
      
1. Name availability (e.g., "Is the name 'testname123' available?")
2. Name registration (e.g., "Register the name 'mynewname'")
3. Text records (e.g., "Get text record for com.discord")
4. Contract owner (e.g., "Who owns the contract?")
5. Base node (e.g., "What's the base node?")
6. Symbol (e.g., "What's the symbol?")`;
    }
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 