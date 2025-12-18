// API Configuration
// Update this with your server's IP address or domain

export const API_CONFIG = {
  // For development (Android emulator)
  // BASE_URL: 'http://10.0.2.2:8080/api',
  
  // For development (iOS simulator)
  // BASE_URL: 'http://localhost:8080/api',
  
  // For physical device (replace with your server IP)
  BASE_URL: __DEV__ 
    ? 'http://192.168.1.100:8080/api' // Change to your local network IP
    : 'https://your-production-server.com/api',
};

