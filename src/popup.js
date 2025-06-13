document.addEventListener('DOMContentLoaded', function() {
  const status = document.getElementById('status');
  const tokenInfo = document.getElementById('tokenInfo');
  const closeBtn = document.getElementById('closeBtn');
  const autoCloseTimer = document.getElementById('autoCloseTimer');
  
  let autoCloseTimeout;
  let countdownInterval;
  let remainingTime = 5;
  
  // Auto-extract token immediately when popup opens
  extractToken();
  
  // Close button functionality
  closeBtn.addEventListener('click', function() {
    window.close();
  });
  
  // Start auto-close countdown
  function startAutoClose() {
    remainingTime = 5;
    updateCountdown();
    
    countdownInterval = setInterval(() => {
      remainingTime--;
      updateCountdown();
      
      if (remainingTime <= 0) {
        clearInterval(countdownInterval);
        window.close();
      }
    }, 1000);
  }
  
  function updateCountdown() {
    autoCloseTimer.textContent = `Auto-close in ${remainingTime}s`;
  }
  
  // Stop auto-close when user interacts with popup
  document.addEventListener('mouseover', function() {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      autoCloseTimer.textContent = '';
    }
  });
  
  async function extractToken() {
    try {
      console.log('Requesting token from background script...');
      
      // Request token from background script
      const response = await chrome.runtime.sendMessage({action: 'getLatestToken'});
      
      console.log('Response from background:', response);
      
      if (response.token) {
        // Copy to clipboard
        await navigator.clipboard.writeText(response.token);
        
        status.textContent = 'Token copied to clipboard!';
        status.className = 'success';
        
        // Decode and display JWT information
        displayTokenInfo(response.token);
        
        // Start auto-close timer after successful extraction
        startAutoClose();
        
      } else {
        // Show debug information
        let debugMsg = 'No bearer token found in recent requests';
        if (response.debug) {
          debugMsg += `\n\nDebug Info:\n- Total requests monitored: ${response.debug.totalRequests}\n- Requests with tokens: ${response.debug.requestsWithTokens}`;
          if (response.debug.latestRequestUrls.length > 0) {
            debugMsg += `\n- Recent URLs: ${response.debug.latestRequestUrls.slice(0, 3).join(', ')}`;
          }
        }
        
        status.textContent = debugMsg;
        status.className = 'error';
        
        // Show instructions for debugging
        showDebugInfo(response.debug);
        startAutoClose();
      }
    } catch (error) {
      console.error('Error:', error);
      status.textContent = 'Error extracting token: ' + error.message;
      status.className = 'error';
      startAutoClose();
    }
  }
  
  function showDebugInfo(debug) {
    if (!debug) return;
    
    let html = '<div class="token-section">';
    html += '<div class="section-title">Debug Information</div>';
    html += '<div class="section-content">';
    html += `Total requests monitored: ${debug.totalRequests}<br>`;
    html += `Requests with Bearer tokens: ${debug.requestsWithTokens}<br><br>`;
    
    if (debug.latestRequestUrls.length > 0) {
      html += 'Recent request URLs:<br>';
      debug.latestRequestUrls.forEach(url => {
        html += `• ${url.substring(0, 60)}${url.length > 60 ? '...' : ''}<br>`;
      });
    } else {
      html += 'No recent requests detected.<br><br>';
      html += '<strong>Troubleshooting:</strong><br>';
      html += '1. Make sure you\'re on a website that makes API calls<br>';
      html += '2. Try refreshing the page and performing some actions<br>';
      html += '3. Check if the site uses Authorization headers';
    }
    
    html += '</div></div>';
    
    tokenInfo.innerHTML = html;
    tokenInfo.style.display = 'block';
  }
  
  function displayTokenInfo(token) {
    try {
      // Try to decode as JWT
      const decoded = decodeJWT(token);
      if (decoded) {
        renderJWTInfo(decoded, token);
      } else {
        renderRawToken(token);
      }
      tokenInfo.style.display = 'block';
    } catch (error) {
      console.error('Error displaying token info:', error);
      renderRawToken(token);
      tokenInfo.style.display = 'block';
    }
  }
  
  function decodeJWT(token) {
    try {
      // JWT tokens have 3 parts separated by dots
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null; // Not a JWT
      }
      
      // Decode header and payload (ignore signature)
      const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      
      return { header, payload };
    } catch (error) {
      return null; // Not a valid JWT
    }
  }
  
  function renderJWTInfo(decoded, rawToken) {
    const { header, payload } = decoded;
    
    let html = '<div class="token-section">';
    html += '<div class="section-title">JWT Claims</div>';
    html += '<div class="claims-grid">';
    
    // Display common claims with user-friendly labels
    const claimLabels = {
      'iss': 'Issuer',
      'sub': 'Subject',
      'aud': 'Audience',
      'exp': 'Expires',
      'nbf': 'Not Before',
      'iat': 'Issued At',
      'jti': 'JWT ID',
      'name': 'Name',
      'email': 'Email',
      'role': 'Role',
      'roles': 'Roles',
      'scope': 'Scope',
      'permissions': 'Permissions'
    };
    
    // Sort claims to show important ones first
    const sortedClaims = Object.entries(payload).sort(([a], [b]) => {
      const aImportant = claimLabels[a] ? 0 : 1;
      const bImportant = claimLabels[b] ? 0 : 1;
      return aImportant - bImportant || a.localeCompare(b);
    });
    
    sortedClaims.forEach(([key, value]) => {
      const label = claimLabels[key] || key;
      let displayValue = value;
      
      // Format timestamp claims
      if (['exp', 'nbf', 'iat'].includes(key) && typeof value === 'number') {
        const date = new Date(value * 1000);
        displayValue = `${date.toLocaleString()} (${value})`;
      }
      
      // Format arrays
      if (Array.isArray(value)) {
        displayValue = value.join(', ');
      }
      
      // Format objects
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        displayValue = JSON.stringify(value);
      }
      
      html += `<div class="claim-key">${label}:</div>`;
      html += `<div class="claim-value">${displayValue}</div>`;
    });
    
    html += '</div></div>';
    
    // Add token creation time
    if (payload.iat) {
      const createdAt = new Date(payload.iat * 1000);
      html += '<div class="token-section">';
      html += '<div class="section-title">Token Created</div>';
      html += `<div class="section-content">${createdAt.toLocaleString()}</div>`;
      html += '</div>';
    }
    
    // Add expiry information
    if (payload.exp) {
      const expiresAt = new Date(payload.exp * 1000);
      const now = new Date();
      const isExpired = expiresAt < now;
      const timeLeft = isExpired ? 'Expired' : getTimeRemaining(expiresAt, now);
      
      html += '<div class="token-section">';
      html += '<div class="section-title">Token Expires</div>';
      html += `<div class="section-content">${expiresAt.toLocaleString()}<br><strong>${timeLeft}</strong></div>`;
      html += '</div>';
    }
    
    // Add raw token preview
    html += '<div class="token-section">';
    html += '<div class="section-title">Raw Token (First 50 chars)</div>';
    html += `<div class="section-content">${rawToken.substring(0, 50)}...</div>`;
    html += '</div>';
    
    tokenInfo.innerHTML = html;
  }
  
  function renderRawToken(token) {
    let html = '<div class="token-section">';
    html += '<div class="section-title">Bearer Token (Non-JWT)</div>';
    html += `<div class="section-content">${token.substring(0, 100)}${token.length > 100 ? '...' : ''}</div>`;
    html += '</div>';
    
    tokenInfo.innerHTML = html;
  }
  
  function getTimeRemaining(expiresAt, now) {
    const diff = expiresAt - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days !== 1 ? 's' : ''} remaining`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} remaining`;
    } else {
      return 'Expires soon';
    }
  }
});