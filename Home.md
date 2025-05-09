# Welcome to CodeFace Wiki

> **Important:** This wiki contains placeholder values that need to be replaced before public use. 
> Replace all instances of `YOUR_USERNAME` with your actual GitHub username or organization name.

<div align="center">
  <img src="public/logos/logo.gif" alt="CodeFace Logo" width="150px" />
  <h1>CodeFace</h1>
  <p>Modern AI chat interface with cyber-neon aesthetics</p>
</div>

## About CodeFace

CodeFace is a modern AI chat interface specifically designed for code-related discussions, featuring:
- Real-time code assistance with AI integration
- Syntax highlighting with copy functionality
- Dark/light theme with cyber-neon aesthetics
- Mobile-responsive design
- WebSocket-based real-time updates

## Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/CodeFace.git

# Navigate to the project directory
cd CodeFace

# Run a local web server
python -m http.server 8000
```

## Open-Source vs Premium Features

CodeFace offers both open-source and premium features to serve different user needs:

### Open-Source Features (Free)
- Basic chat interface with AI assistance
- Standard code syntax highlighting
- Light/dark theme switching
- Basic keyboard shortcuts
- Limited message history
- Community support

### Premium Features
- Advanced AI model integrations
- Enhanced syntax highlighting with additional languages
- Context-aware code completion
- Extended message history and conversation management
- Priority support and feature requests
- Custom theme options
- Terminal and tmux integration
- Rust-optimized performance features

## How to Access Premium Features

1. Become a sponsor through [GitHub Sponsors](https://github.com/sponsors/YOUR_USERNAME)
2. Receive a unique access token via email
3. Enter your token in the CodeFace settings page
4. Instantly unlock premium features across all your devices

## Wiki Navigation

- **[Architecture](Architecture)** - System architecture, component hierarchy, and data flow patterns
- **[API](API)** - API documentation, endpoints, and integration patterns
- **[UI Components](UI-Components)** - UI component documentation and theme system
- **[Deployment](Deployment)** - Deployment guides, infrastructure setup, and monitoring
- **[Contributing](Contributing)** - Contribution guidelines, branching strategy, and development workflow

# CodeFace

<div align="center">
  <img src="public/logos/logo.gif" alt="CodeFace Logo" width="150px" />
  <p>Modern AI chat interface with cyber-neon aesthetics</p>
  <p><strong>Version: v0.1.2</strong></p>
</div>

Welcome to the CodeFace wiki! This page provides an overview of our project, its features, and how to get started. CodeFace offers both open-source and premium features to serve a wide range of users.

## Project Overview

CodeFace is a modern AI chat interface specifically designed for code-related discussions, featuring:

- Real-time code assistance with AI integration
- Syntax highlighting with copy functionality
- Dark/light theme with cyber-neon aesthetics
- Mobile-responsive design
- WebSocket-based real-time updates

Our mission is to create a powerful yet beautiful interface for developers to interact with AI assistants for coding tasks. CodeFace combines cutting-edge technology with a visually appealing cyber-neon aesthetic to provide a unique and productive coding experience.

The project follows a dual-license model that allows us to maintain a robust open-source core while funding development through premium features available to sponsors.

## Core Features (Open Source)

All core features are available in the `/src/core` directory and are released under the [MIT License](./LICENSE).

### Included in Open Source Version:

- Basic chat interface with AI assistance
- Standard code syntax highlighting
- Light/dark theme switching with cyber-neon aesthetics
- Basic keyboard shortcuts
- Responsive design for desktop and mobile
- Copy functionality for code blocks
- Markdown rendering
- Limited message history
- Community support

The open-source core of CodeFace provides a complete, functional chat interface that can be used without any premium features. The code is designed to be modular, allowing for easy extension and customization.

### Core Structure

- `src/core/index.js` - Main entry point for core features
- `src/core/components/` - UI components for the core interface
- `src/core/styles/` - Styling for core components
- `src/core/utils/` - Utility functions for core features

## Premium Features

Premium features are located in the `/src/premium` directory and are available exclusively to sponsors under a [proprietary license](./LICENSE-PREMIUM).

### Included in Premium Version:

- Advanced AI model integrations
- Enhanced syntax highlighting with additional languages
- Context-aware code completion
- Extended message history and conversation management
- Priority support and feature requests
- Custom theme options
- Terminal and tmux integration
- Rust-optimized performance features

The premium version builds upon the open-source core to provide enhanced functionality for professional developers and teams that need more advanced features and support.

### Premium Structure

Premium features integrate seamlessly with the core codebase while maintaining separation for licensing purposes:

- `src/premium/index.js` - Entry point for premium features
- `src/premium/components/` - Enhanced UI components
- `src/premium/models/` - Advanced AI model integrations
- `src/premium/utils/` - Extended utility functions

## Sponsorship Tiers and Benefits

Support CodeFace development and gain access to premium features through our sponsorship program:

### GitHub Sponsors Tiers

- **Coder Tier ($5/month)**
  - Access to all premium features
  - Monthly usage credits for AI model API calls
  - Access to the premium documentation

- **Developer Tier ($10/month)**
  - All Coder tier benefits
  - Priority support via dedicated Discord channel
  - Increased usage credits for AI model API calls
  - Voting rights for feature prioritization

- **Maintainer Tier ($25/month)**
  - All Developer tier benefits
  - Early access to new features
  - Custom theme configuration
  - Dedicated support contact
  - Participation in monthly development roadmap calls

- **Enterprise Tier (Contact us)**
  - All Maintainer tier benefits
  - Custom deployment and integration support
  - SLA options
  - White-labeling options
  - Custom feature development

### How to Access Premium Features

1. Become a sponsor through [GitHub Sponsors](https://github.com/sponsors/YOUR_USERNAME)
2. Receive a unique access token via email
3. Enter your token in the CodeFace settings page
4. Instantly unlock premium features across all your devices

*Note: Your sponsorship directly supports open-source development and helps us maintain both free and premium versions.*

## Getting Started

### Prerequisites
- Node.js 16+
- Python 3.9+ (for backend integration)
- PostgreSQL 13+ (for backend integration)
- Redis 6+ (for backend integration)

### Quick Start (Current Implementation)

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/CodeFace.git

# Navigate to the project directory
cd CodeFace

# Run a local web server
python -m http.server 8000
```

### Development Setup (Planned Implementation)

```bash
# Frontend setup
cd frontend
npm install
npm run dev

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Unix
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Environment Configuration

```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000

# Backend (.env)
DATABASE_URL=postgresql://user:pass@localhost:5432/codeface
MODEL_PATH=/path/to/model
```

## Contributing Guidelines

CodeFace welcomes contributions from the community! Here's how you can contribute:

### Branching Strategy

This project follows GitFlow branching strategy:
- `main` - Production-ready code
- `develop` - Development branch for integration
- `feature/*` - Feature branches
- `release/*` - Release preparation branches
- `hotfix/*` - Hotfix branches for urgent fixes

### Development Workflow

1. **Fork the Repository**
   - Create your own fork of the project

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/CodeFace.git
   cd CodeFace
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Your Changes**
   - Implement your changes
   - Add tests if applicable
   - Update documentation

5. **Commit Your Changes**
   ```bash
   git commit -m "Add feature: your feature description"
   ```

6. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Submit a Pull Request**
   - Open a pull request from your feature branch to the `develop` branch of the main repository
   - Follow the pull request template

### Code Standards

- TypeScript for frontend
- Python type hints for backend
- ESLint/Black formatting
- 100% test coverage goal

### Documentation

For all contributions, please:
- Update relevant documentation
- Add inline code comments for complex logic
- Create or update wiki pages for significant features

### Licensing Considerations

- Contributions to `/src/core` will be under the MIT license
- Contributions to `/src/premium` will be under the proprietary license

By contributing to CodeFace, you agree that your contributions will be licensed under the respective license for the directory you're contributing to.

---

## Additional Resources

- [Architecture Documentation](./docs/architecture/)
- [API Documentation](./docs/api/)
- [UI Component Guide](./docs/ui/)
- [Deployment Guide](./docs/deployment/)

For further assistance, please open an issue on GitHub or contact the maintainers directly.

