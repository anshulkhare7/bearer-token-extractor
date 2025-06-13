// Background script to monitor HTTP requests
let requestsWithTokens = [];
let allRequests = [];

console.log('Background script loaded');

// Listen for all HTTP requests
chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    console.log('Request intercepted:', details.url);
    
    // Store all requests for debugging
    const requestInfo = {
      url: details.url,
      headers: details.requestHeaders || [],
      timestamp: Date.now(),
      method: details.method
    };
    
    allRequests.unshift(requestInfo); // Add to beginning
    if (allRequests.length > 50) {
      allRequests.pop(); // Keep only last 50 requests
    }
    
    // Check if this request has a bearer token
    const token = extractTokenFromHeaders(details.requestHeaders || []);
    if (token) {
      console.log('Bearer token found in request to:', details.url);
      requestsWithTokens.unshift({
        ...requestInfo,
        token: token
      });
      
      // Keep only last 10 requests with tokens
      if (requestsWithTokens.length > 10) {
        requestsWithTokens.pop();
      }
    }
  },
  {urls: ["<all_urls>"]},
  ["requestHeaders"]
);

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getLatestToken") {
    console.log('Token requested. Requests with tokens:', requestsWithTokens.length);
    console.log('Total requests monitored:', allRequests.length);
    
    const token = getLatestBearerToken();
    const debugInfo = {
      totalRequests: allRequests.length,
      requestsWithTokens: requestsWithTokens.length,
      latestRequestUrls: allRequests.slice(0, 5).map(r => r.url)
    };
    
    console.log('Debug info:', debugInfo);
    sendResponse({
      token: token,
      debug: debugInfo
    });
  }
});

function extractTokenFromHeaders(headers) {
  if (!headers) return null;
  
  for (const header of headers) {
    if (header.name && header.name.toLowerCase() === 'authorization') {
      const value = header.value;
      if (value && value.toLowerCase().startsWith('bearer ')) {
        return value.substring(7); // Remove 'Bearer ' prefix
      }
    }
  }
  return null;
}

function getLatestBearerToken() {
  if (requestsWithTokens.length > 0) {
    return requestsWithTokens[0].token;
  }
  return null;
}