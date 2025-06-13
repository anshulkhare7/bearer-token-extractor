# Contributing to Bearer Token Extractor

Thank you for your interest in contributing to Bearer Token Extractor! We welcome contributions from the community and are pleased to have you join us.

## 🤝 Ways to Contribute

- **🐛 Report bugs** - Help us identify and fix issues
- **💡 Suggest features** - Share ideas for new functionality
- **📝 Improve documentation** - Help make our docs clearer
- **🔧 Submit code changes** - Fix bugs or implement features
- **🧪 Test and provide feedback** - Help us ensure quality

## 🚀 Getting Started

### Prerequisites

- **Microsoft Edge** (latest version recommended)
- **Git** for version control
- **Basic knowledge** of JavaScript, HTML, and browser extensions
- **Text editor** or IDE of your choice

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/yourusername/bearer-token-extractor.git
   cd bearer-token-extractor
   ```

3. **Load the extension** in Edge:

   - Open `edge://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `src/` directory

4. **Make your changes** and test thoroughly

5. **Reload the extension** after each change:
   - Go to `edge://extensions/`
   - Click the reload button on the extension

## 📋 Development Guidelines

### Code Style

- **JavaScript**: Use modern ES6+ features where supported
- **Indentation**: 2 spaces (no tabs)
- **Naming**: Use camelCase for variables and functions
- **Comments**: Add clear comments for complex logic
- **Console logs**: Use for debugging but remove before submitting

#### Example Code Style:

```javascript
// Good
function extractTokenFromHeaders(headers) {
  if (!headers) return null;

  for (const header of headers) {
    if (header.name && header.name.toLowerCase() === "authorization") {
      const value = header.value;
      if (value && value.toLowerCase().startsWith("bearer ")) {
        return value.substring(7); // Remove 'Bearer ' prefix
      }
    }
  }
  return null;
}

// Avoid
function extractTokenFromHeaders(headers) {
  if (!headers) return null;
  for (var i = 0; i < headers.length; i++) {
    if (headers[i].name.toLowerCase() === "authorization") {
      var value = headers[i].value;
      if (value && value.toLowerCase().startsWith("bearer ")) {
        return value.substring(7);
      }
    }
  }
  return null;
}
```

### File Organization

- **Keep related code together** - Similar functions in the same file
- **Separate concerns** - UI logic in popup.js, request monitoring in background.js
- **Use descriptive names** - File and function names should be self-explanatory
- **Minimize dependencies** - Avoid external libraries when possible

### Testing Your Changes

Before submitting a pull request, please test:

#### Manual Testing Checklist

- [ ] **Basic functionality** - Extension loads and icon appears
- [ ] **Token extraction** - Works on sites with Bearer tokens
- [ ] **JWT decoding** - Correctly parses and displays JWT claims
- [ ] **Error handling** - Graceful behavior when no tokens found
- [ ] **UI interactions** - Popup opens, closes, auto-close works
- [ ] **Cross-browser** - Test in different versions of Edge if possible

#### Test Sites

Use these sites for testing (when logged in):

- **GitHub** - Good for JWT tokens
- **Gmail/Google Workspace** - Various token types
- **Any authenticated web application**

#### Debugging

1. **Background script logs**:

   - `edge://extensions/` → Extension details → "Inspect views: background page"
   - Check console for request monitoring logs

2. **Popup debugging**:
   - Right-click popup → "Inspect"
   - Check for JavaScript errors

## 📝 Submitting Changes

### Pull Request Process

1. **Create a feature branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the guidelines above

3. **Test thoroughly** using the checklist

4. **Commit with clear messages**:

   ```bash
   git add .
   git commit -m "Add support for custom token prefixes

   - Allow detection of tokens with prefixes other than 'Bearer'
   - Add configuration option for custom prefixes
   - Update UI to show detected prefix type"
   ```

5. **Push to your fork**:

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub with:
   - **Clear title** describing the change
   - **Detailed description** of what was changed and why
   - **Test results** or screenshots if relevant
   - **Reference any related issues** (#123)

### Pull Request Template

When creating a PR, please include:

```markdown
## Description

Brief description of changes made

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing

- [ ] Tested manually on multiple sites
- [ ] Verified JWT decoding works correctly
- [ ] Confirmed no console errors
- [ ] Tested error scenarios

## Screenshots (if applicable)

Include screenshots showing the changes

## Related Issues

Closes #123
```

## 🐛 Reporting Bugs

### Before Reporting

1. **Check existing issues** to avoid duplicates
2. **Test with the latest version**
3. **Verify it's not a site-specific issue**

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:

1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**

- Edge version: [e.g. 91.0.864.59]
- Extension version: [e.g. 1.0.0]
- OS: [e.g. Windows 10, macOS 12.0]

**Additional context**

- Website where the issue occurred
- Console error messages
- Any other relevant information
```

## 💡 Feature Requests

### Before Requesting

1. **Check existing issues** for similar requests
2. **Consider if it fits the extension's scope**
3. **Think about implementation complexity**

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request.
```

## 🎯 Good First Issues

New contributors can start with these types of issues:

- **Documentation improvements** - Fix typos, add examples
- **UI enhancements** - Improve styling, add icons
- **Error message improvements** - Make error messages clearer
- **Code comments** - Add explanatory comments
- **Testing** - Help identify edge cases

Look for issues labeled `good-first-issue` or `help-wanted`.

## 📚 Architecture Overview

Understanding the codebase:

### Key Files

- `src/manifest.json` - Extension configuration and permissions
- `src/background.js` - Service worker for request monitoring
- `src/popup.js` - UI logic and JWT decoding
- `src/popup.html` - Extension popup interface

### Request Flow

```
HTTP Request → webRequest API → Background Script → Token Storage → Popup Request → Display
```

### JWT Processing

```
Raw Token → Base64 Decode → JSON Parse → Claim Extraction → UI Rendering
```

## 🔒 Security Considerations

When contributing, please keep in mind:

- **No external requests** - All processing should be local
- **Minimal permissions** - Don't request unnecessary permissions
- **Token handling** - Never log or persist sensitive tokens
- **Input validation** - Validate all user inputs and token data
- **XSS prevention** - Sanitize any displayed content

## 📞 Getting Help

If you need help:

- **Check the documentation** in the `docs/` folder
- **Search existing issues** for similar questions
- **Create a discussion** for general questions
- **Join our community** (if applicable)

## 🏆 Recognition

Contributors are recognized in:

- **README.md** - Contributor section
- **Release notes** - Major contributions mentioned
- **GitHub insights** - All contributions tracked

## 📜 Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms:

- **Be respectful** and inclusive
- **Provide constructive feedback**
- **Focus on what is best** for the community
- **Show empathy** towards other community members

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License that covers the project.

---

Thank you for contributing to Bearer Token Extractor! 🎉
