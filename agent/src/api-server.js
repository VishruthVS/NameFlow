import express from 'express';
import cors from 'cors';
import { CreditScoreService } from './contract-details.service';

// Contract address
const CONTRACT_ADDRESS = '0xE6Bc22b247F6c294C4C3F2852878F3e4c538098b';

// Create service instance
const contractService = new CreditScoreService(CONTRACT_ADDRESS);

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Text record endpoint
//@ts-ignore
app.post('/api/text-record', async (req, res) => {
  try {
    const { key } = req.body;
    
    if (!key) {
      return res.status(400).json({
        error: 'Please provide a key in the request body',
        timestamp: new Date().toISOString()
      });
    }
    
    // Get text record
    const result = await contractService.getTextRecord(key);
    
    // Send response
    res.json(result);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      error: 'Failed to process request',
      timestamp: new Date().toISOString()
    });
  }
});

// Owner endpoint
app.get('/api/owner', async (req, res) => {
  try {
    const result = await contractService.getContractOwner();
    res.json(result);
  } catch (error) {
    console.error('Error getting owner:', error);
    res.status(500).json({
      error: 'Failed to get owner',
      timestamp: new Date().toISOString()
    });
  }
});

// Base node endpoint
app.get('/api/base-node', async (req, res) => {
  try {
    const result = await contractService.getBaseNode();
    res.json(result);
  } catch (error) {
    console.error('Error getting base node:', error);
    res.status(500).json({
      error: 'Failed to get base node',
      timestamp: new Date().toISOString()
    });
  }
});

// Symbol endpoint
app.get('/api/symbol', async (req, res) => {
  try {
    const result = await contractService.getSymbol();
    res.json(result);
  } catch (error) {
    console.error('Error getting symbol:', error);
    res.status(500).json({
      error: 'Failed to get symbol',
      timestamp: new Date().toISOString()
    });
  }
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`- POST http://localhost:${PORT}/api/text-record - Get a text record (requires key in body)`);
  console.log(`- GET http://localhost:${PORT}/api/owner - Get the contract owner`);
  console.log(`- GET http://localhost:${PORT}/api/base-node - Get the base node`);
  console.log(`- GET http://localhost:${PORT}/api/symbol - Get the contract symbol`);
});

// Export the app for testing purposes
export { app }; 