# Bearer Token Extractor

A Microsoft Edge browser extension that automatically extracts and copies Bearer tokens from HTTP requests to your clipboard, with JWT decoding and analysis.

_Disclaimer: 99% of the code and document has been generated using AI._

<!--
![Extension Demo](screenshots/demo.png)
-->

## Features

- ** One-click extraction** - Automatically copies the latest Bearer token to clipboard when you click the extension icon
- ** JWT Analysis** - Intelligently decodes JWT tokens and displays claims, expiration times, and token details
- ** Smart timing** - Shows token creation time, expiration status, and remaining validity
- ** Auto-close** - Popup automatically closes after 5 seconds (hover to prevent)
- ** Debug mode** - Shows request monitoring statistics when no tokens are found
- ** Request history** - Tracks recent requests with Bearer tokens

<!--
## 🖼️ Screenshots

|            JWT Token Analysis             |           Token Claims View           |
| :---------------------------------------: | :-----------------------------------: |
| ![JWT Analysis](screenshots/jwt-view.png) | ![Claims](screenshots/popup-demo.png) |
-->

## Installation

### From Source (Developer Mode)

1. **Download** or clone this repository
2. **Open Microsoft Edge** and navigate to `edge://extensions/`
3. **Enable "Developer mode"** (toggle in the left sidebar)
4. **Click "Load unpacked"**
5. **Select the `src/` folder** from this repository
6. The extension should now appear in your toolbar!

### From Release Package

1. **Download** the latest `.zip` file from the [Releases](releases/) section
2. **Extract** the zip file
3. **Follow steps 2-5** from the "From Source" instructions above

## Usage

1. **Navigate** to any website that makes authenticated API calls (web apps, dashboards, etc.)
2. **Perform actions** that trigger HTTP requests (login, navigate, submit forms)
3. **Click the extension icon** in your toolbar
4. **Token automatically copied!** The Bearer token is instantly copied to your clipboard
5. **View token details** - If it's a JWT, see decoded claims, expiration time, and more

### Supported Token Types

- **JWT (JSON Web Tokens)** - Full decoding with claims analysis
- **Generic Bearer tokens** - Raw token extraction and display
- **Any Authorization header** - Automatic Bearer token detection

## Development

### Prerequisites

- Microsoft Edge (latest version)
- Basic knowledge of JavaScript and browser extensions

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/bearer-token-extractor.git
   cd bearer-token-extractor
   ```

2. **Load in Edge** (follow installation steps above using the `src/` folder)

3. **Make changes** to files in the `src/` directory

4. **Reload extension** in `edge://extensions/` after making changes

### File Structure

- `src/manifest.json` - Extension configuration and permissions
- `src/background.js` - Service worker that monitors HTTP requests
- `src/popup.html` - Extension popup interface
- `src/popup.js` - Popup functionality and JWT decoding
- `src/icons/` - Extension icons

## Privacy & Security

- **Local processing only** - All token analysis happens locally in your browser
- **No data transmission** - Tokens are never sent to external servers
- **Temporary storage** - Only keeps tokens in memory during browser session
- **Minimal permissions** - Only requests necessary permissions for functionality

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Known Issues

- Some websites with strict CORS policies may not expose Authorization headers
- Extension requires active HTTP requests to capture tokens
- Only works with standard "Bearer " token format

## Support

If you encounter any issues or have feature requests, please [open an issue](../../issues) on GitHub.

## Acknowledgments

- This plugin was developed with AI assitance(Claude)
