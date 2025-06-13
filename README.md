# Yatzy Score Form

A modern, user-friendly web application for tracking and scoring Yatzy games. Built with React, Vite, and TypeScript.

## Features

- Add and manage multiple players
- Interactive Yatzy score sheet with automatic sum and bonus calculation
- Scoreboard with round-by-round and overall winner display
- Tooltips for all lower section categories, explaining scoring rules
- Light and dark mode toggle
- Responsive, accessible, and mobile-friendly UI
- 100% tested with Playwright end-to-end tests

## Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Linting & Formatting

- Check formatting: `npm run format`
- Fix formatting: `npm run format:fix`
- Check linting: `npm run lint`
- Fix linting: `npm run lint:fix`

### Testing

- Run all Playwright end-to-end tests: `npm run test:e2e`
- Generate coverage report: `npm run coverage:html`

### Project Structure

- `src/` — Main source code (components, hooks, utils, styles)
- `e2e/` — Playwright end-to-end tests
- `public/` — Static assets
- `README.md` — Project documentation

## Contributing

- Follow best practices for React, TypeScript, and modern frontend development
- All new features should include Playwright tests for 100% coverage
- Fix all lint and formatting issues before submitting code

## License

MIT
