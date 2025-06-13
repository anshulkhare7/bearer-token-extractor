# Development Guide

This guide will help you set up the development environment and understand the codebase.

## Architecture Overview

The extension consists of three main components:

### 1. Background Script (`background.js`)

- **Purpose**: Service worker that monitors all HTTP requests
- **Key functions**:
  - `onBeforeSendHeaders` - Intercepts requests and extracts Bearer tokens
  - `extractTokenFromHeaders()` - Parses Authorization headers
  - `getLatestBearerToken()` - Returns the most recent token found

### 2. Popup Interface (`popup.html` + `popup.js`)

- **Purpose**: User interface displayed when extension icon is clicked
- **Key functions**:
  - `extractToken()` - Requests token from background script
  - `decodeJWT()` - Parses and validates JWT structure
  - `renderJWTInfo()` - Displays decoded token information
  - Auto-close functionality with countdown timer

### 3. Manifest (`manifest.json`)

- **Purpose**: Extension configuration and permissions
- **Key permissions**:
  - `webRequest` - Monitor HTTP requests
  - `clipboardWrite` - Copy tokens to clipboard
  - `activeTab` - Access current tab
  - `<all_urls>` - Monitor requests to all websites

## Development Setup

### 1. Environment Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd bearer-token-extractor

# No build tools required - it's pure HTML/CSS/JS!
```

### 2. Load Extension in Edge

1. Open `edge://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `src/` directory

### 3. Development Workflow

1. Make changes to files in `src/`
2. Go to `edge://extensions/`
3. Click the "Reload" button on your extension
4. Test the changes

## Testing

### Manual Testing Checklist

#### Basic Functionality

- [ ] Extension icon appears in toolbar
- [ ] Clicking icon opens popup
- [ ] Popup auto-closes after 5 seconds
- [ ] Close button (×) works
- [ ] Hovering stops auto-close timer

#### Token Extraction

- [ ] Test on site with JWT tokens (e.g., authenticated web app)
- [ ] Test on site with non-JWT Bearer tokens
- [ ] Test on site with no Authorization headers
- [ ] Verify token is copied to clipboard
- [ ] Check debug information when no tokens found

#### JWT Decoding

- [ ] JWT claims display correctly
- [ ] Timestamp formatting works (exp, iat, nbf)
- [ ] Expiration countdown shows correctly
- [ ] Token creation time displays
- [ ] Raw token preview shows

### Test Sites

Good sites for testing (when logged in):

- **GitHub** - Uses JWT tokens
- **Gmail/Google Workspace** - Uses Bearer tokens
- **Postman Web** - API testing with custom tokens
- **Any SPA application** you're logged into

### Debugging

#### Background Script Debugging

1. Go to `edge://extensions/`
2. Find your extension → "Details"
3. Click "Inspect views: background page"
4. Check Console tab for logs:
   - Request interceptions
   - Token discoveries
   - Error messages

#### Popup Debugging

1. Right-click on extension popup
2. Select "Inspect"
3. Check Console tab for errors

#### Common Debug Logs

```javascript
// In background.js console:
"Background script loaded";
"Request intercepted: https://api.example.com/data";
"Bearer token found in request to: https://api.example.com/auth";

// In popup.js console:
"Requesting token from background script...";
"Response from background: {token: '...', debug: {...}}";
```

## Code Structure Explained

### Request Monitoring Flow

```
HTTP Request → webRequest.onBeforeSendHeaders → extractTokenFromHeaders() → Store in requestsWithTokens[]
```

### Token Extraction Flow

```
User clicks icon → popup.js → chrome.runtime.sendMessage() → background.js → getLatestBearerToken() → Return to popup
```

### JWT Processing Flow

```
Token received → decodeJWT() → Parse header/payload → renderJWTInfo() → Display in popup
```

## Performance Considerations

- **Memory usage**: Only stores last 50 requests and 10 tokens
- **Request filtering**: Monitors all URLs but only processes Authorization headers
- **JWT parsing**: Uses built-in `atob()` for Base64 decoding (no external libraries)

## Security Notes

- **Permissions**: Uses minimal required permissions
- **Data handling**: No external network requests, all processing local
- **Token storage**: Tokens only kept in memory, cleared on browser restart
- **HTTPS requirement**: Clipboard API requires secure context

## Adding New Features

### Adding New Token Formats

1. Modify `extractTokenFromHeaders()` in `background.js`
2. Add detection logic for new header format
3. Update `renderJWTInfo()` if special display needed

### Adding New JWT Claims

1. Update `claimLabels` object in `popup.js`
2. Add formatting logic if needed (like timestamps)

### Adding Configuration

1. Add `storage` permission to manifest
2. Create options page (`options.html`, `options.js`)
3. Store settings in `chrome.storage.sync`

## Browser Compatibility

This extension is designed for Microsoft Edge (Chromium-based) but can be easily adapted for:

- **Chrome**: Change manifest to Chrome extension format
- **Firefox**: Convert to Manifest V2 and adjust APIs
- **Safari**: Use Safari Web Extension format

## Troubleshooting

### Extension Not Loading

- Check manifest.json syntax
- Verify all file paths exist
- Check permissions in manifest

### No Tokens Found

- Verify site makes authenticated requests
- Check network tab for Authorization headers
- Test with known JWT-using sites

### Popup Not Working

- Check popup.js for JavaScript errors
- Verify HTML/CSS syntax
- Test clipboard permissions (HTTPS required)
