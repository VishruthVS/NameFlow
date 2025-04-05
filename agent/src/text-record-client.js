import axios from 'axios';

// API base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Function to get text record from the API
export async function fetchTextRecord(key) {
  try {
    // Make a POST request to the API with the key in the request body
    const response = await axios.post(`${API_BASE_URL}/text-record`, { key });
    return response.data;
  } catch (error) {
    console.error('Error fetching text record:', error);
    return {
      error: 'Failed to fetch text record',
      timestamp: new Date().toISOString()
    };
  }
}

// Function to get contract owner
export async function fetchContractOwner() {
  try {
    const response = await axios.get(`${API_BASE_URL}/owner`);
    return response.data;
  } catch (error) {
    console.error('Error fetching contract owner:', error);
    return {
      error: 'Failed to fetch contract owner',
      timestamp: new Date().toISOString()
    };
  }
}

// Function to get base node
export async function fetchBaseNode() {
  try {
    const response = await axios.get(`${API_BASE_URL}/base-node`);
    return response.data;
  } catch (error) {
    console.error('Error fetching base node:', error);
    return {
      error: 'Failed to fetch base node',
      timestamp: new Date().toISOString()
    };
  }
}

// Function to get symbol
export async function fetchSymbol() {
  try {
    const response = await axios.get(`${API_BASE_URL}/symbol`);
    return response.data;
  } catch (error) {
    console.error('Error fetching symbol:', error);
    return {
      error: 'Failed to fetch symbol',
      timestamp: new Date().toISOString()
    };
  }
}

// Example usage
console.log('To use this client:');
console.log('1. Start the API server with: node server.js');
console.log('2. Then make requests with:');
console.log('   fetchTextRecord("description").then(result => console.log(result));');
console.log('   fetchContractOwner().then(result => console.log(result));');
console.log('   fetchBaseNode().then(result => console.log(result));');
console.log('   fetchSymbol().then(result => console.log(result));'); 