# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ByteBeasts Tamagotchi is a React-based web game built on the Starknet blockchain using the Dojo Engine. Players care for virtual creatures called "ByteBeasts" through feeding, cleaning, playing, and sleeping activities. The game implements real-time status updates and blockchain-based persistence.

## Development Commands

### Common Development Tasks
```bash
# Navigate to client directory first
cd client

# Development server (HTTP - default)
pnpm dev

# Development server with HTTPS (required for Controller/Service Worker features)
pnpm mkcert           # Generate certificates first
pnpm dev:https        # Run with HTTPS at https://localhost:3002

# Build and validation
pnpm build            # TypeScript build + Vite production build
pnpm lint             # ESLint validation
pnpm format:check     # Prettier format validation
pnpm format           # Auto-format with Prettier

# Preview production build
pnpm preview          # HTTP preview
pnpm preview:https    # HTTPS preview
```

### Testing
The codebase does not include explicit test commands. Check for test-related dependencies or scripts if testing is needed.

## Code Architecture

### Directory Structure
- `client/src/app/` - Main application entry point and navigation logic
- `client/src/components/screens/` - Screen components (Home, Feed, Sleep, Clean, Play, Market, etc.)
- `client/src/dojo/` - Dojo Engine integration and blockchain interaction
- `client/src/zustand/` - Global state management with Zustand
- `client/src/context/` - React contexts (Music, PostHog analytics)
- `client/src/constants/` - Static configuration and constants
- `client/src/utils/` - Utility functions and helpers

### Key Technologies
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + Framer Motion animations
- **State Management**: Zustand with persistence
- **Blockchain**: Starknet + Dojo Engine + Cartridge Controller
- **Build Tools**: Vite, ESLint, Prettier, Biome (formatting)

### State Management Pattern
The app uses a centralized Zustand store (`client/src/zustand/store.ts`) with:
- **LiveBeast Data**: Single active beast with real-time status
- **Transaction States**: Feed/clean operation tracking
- **Real-time Status**: Contract-first status updates with optimistic UI
- **Auto-sync**: Automatic synchronization between contract and store state

### Screen Navigation
Navigation is handled in `App.tsx` with a state-based router:
- Login → Hatch (new players) or Cover → Home (existing players)
- Home serves as the central hub with NavBar navigation
- Sleep mode blocks navigation to other screens
- Games use fullscreen overlay without NavBar

### Blockchain Integration
- **Dojo Engine**: World state management on Starknet
- **Cartridge Controller**: Wallet integration with session policies
- **Real-time Updates**: Contract polling for live beast status
- **Transaction Management**: Optimistic UI with error handling

### Component Patterns
- **Screen Components**: Full-page components in `screens/` directory
- **Screen Logic**: Custom hooks in `components/hooks/` for business logic
- **Shared Components**: Reusable UI components in `shared/`
- **Type Safety**: Comprehensive TypeScript types in `types/` directories

### Asset Management
- `client/src/assets/` contains game assets organized by category
- Animation frames stored as numbered PNG sequences
- WebP optimization for performance
- SVG icons for UI elements

## Environment Configuration

The app uses environment variables for different deployment targets:
- `VITE_PUBLIC_DEPLOY_TYPE` - Controls mainnet vs sepolia chain selection
- `VITE_PUBLIC_NODE_URL` - Starknet RPC endpoint
- `VITE_PUBLIC_TORII` - Dojo Torii URL for world state
- `VITE_LOCAL_HTTPS` - Enables HTTPS in development

## Code Style

The project uses Biome for formatting with these settings:
- 4-space indentation
- 80-character line width
- Double quotes for JSX
- Semicolons required
- ES5 trailing commas

Follow existing patterns for:
- Custom hooks prefixed with `use`
- Screen components ending with `Screen`
- Type definitions in dedicated `types/` files
- Barrel exports for cleaner imports