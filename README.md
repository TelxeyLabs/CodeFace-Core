<div align="center">
  <img src="public/logos/logo-rgb.gif" alt="CodeFace Logo" width="150px" />
  <h1>CodeFace</h1>
</div>

Modern AI chat interface with a cyber-neon theme, featuring light and dark mode.

## Version

Current version: v0.1.2

## Description

CodeFace is a responsive chat interface designed with a modern cyber-neon aesthetic. It features:

- Light and dark theme support with persistent user preferences
- Stylish message bubbles with proper code formatting
- Responsive design that works on mobile and desktop
- Functional chat interface for sending and receiving messages
- Clean, modern UI with animated elements

## Project Structure

- `index.html` - Main application file (HTML, CSS, and JavaScript)
- `public/logos/` - Logo and favicon assets
- `styles.css` - Additional styles (main styles are inline in index.html)
- `theme-context.js` - Theme context for light/dark mode

## Branching Strategy

This project follows GitFlow branching strategy:

- `main` - Production-ready code
- `develop` - Development branch for integration
- `feature/*` - Feature branches
- `release/*` - Release preparation branches
- `hotfix/*` - Hotfix branches for urgent fixes

## Development

To run the project locally:

```bash
# Clone the repository
git clone https://github.com/Telxey/CodeFace.git

# Navigate to the project directory
cd CodeFace

# Run a local web server
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## License

Private project - All rights reserved.

