# Todo List App

A modern, responsive todo list application built with React, TypeScript, and Vite.

## Features

- ⚡️ Fast development with Vite
- ⚛️ React 18 with TypeScript
- 🎨 Modern UI with CSS
- 🔍 ESLint for code quality
- 💅 Prettier for code formatting
- 🔥 Hot Module Replacement (HMR)

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **ESLint** - Linting
- **Prettier** - Code formatting

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd todo-app
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

### Code Quality

Run ESLint:
```bash
npm run lint
```

Format code with Prettier:
```bash
npm run format
```

Type check:
```bash
npm run type-check
```

## Project Structure

```
todo-app/
├── src/
│   ├── App.tsx         # Main application component
│   ├── App.css         # App styles
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
├── .eslintrc.cjs       # ESLint configuration
└── .prettierrc         # Prettier configuration
```

## License

MIT
