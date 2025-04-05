import http from 'http';
import { CreditScoreService } from './contract-details.service';

// Contract address
const CONTRACT_ADDRESS = '0xE6Bc22b247F6c294C4C3F2852878F3e4c538098b';

// Create service instance
const contractService = new CreditScoreService(CONTRACT_ADDRESS);

// Create HTTP server
const server = http.createServer(async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  // Parse URL to determine the endpoint
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  const path = url.pathname;
  
  // Handle different endpoints
  if (path === '/api/text-record' && req.method === 'POST') {
    // Text record endpoint
    let body = '';
    
    // Collect request body
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    // Process request when body is complete
    req.on('end', async () => {
      try {
        // Parse JSON body
        const data = JSON.parse(body);
        const { key } = data;
        
        if (!key) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Please provide a key in the request body',
            timestamp: new Date().toISOString()
          }));
          return;
        }
        
        // Get text record
        const result = await contractService.getTextRecord(key);
        
        // Send response
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (error) {
        console.error('Error processing request:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Failed to process request',
          timestamp: new Date().toISOString()
        }));
      }
    });
  } else if (path === '/api/owner' && req.method === 'GET') {
    // Owner endpoint
    try {
      const result = await contractService.getContractOwner();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (error) {
      console.error('Error getting owner:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Failed to get owner',
        timestamp: new Date().toISOString()
      }));
    }
  } else if (path === '/api/base-node' && req.method === 'GET') {
    // Base node endpoint
    try {
      const result = await contractService.getBaseNode();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (error) {
      console.error('Error getting base node:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Failed to get base node',
        timestamp: new Date().toISOString()
      }));
    }
  } else if (path === '/api/symbol' && req.method === 'GET') {
    // Symbol endpoint
    try {
      const result = await contractService.getSymbol();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (error) {
      console.error('Error getting symbol:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Failed to get symbol',
        timestamp: new Date().toISOString()
      }));
    }
  } else {
    // Handle other routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Not found',
      timestamp: new Date().toISOString()
    }));
  }
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`- POST http://localhost:${PORT}/api/text-record - Get a text record (requires key in body)`);
  console.log(`- GET http://localhost:${PORT}/api/owner - Get the contract owner`);
  console.log(`- GET http://localhost:${PORT}/api/base-node - Get the base node`);
  console.log(`- GET http://localhost:${PORT}/api/symbol - Get the contract symbol`);
});

// Export the server for testing purposes
export { server }; 