# Play Cricket Client

Client library for Bun/Node.js for Play Cricket data

## Prerequisites

This library is optimized for [Bun](https://bun.sh/) runtime. To install Bun:

```bash
curl -fsSL https://bun.sh/install | bash
```

## Install

```bash
bun add play-cricket-client
```

Or with npm:
```bash
npm install play-cricket-client
```

Or with yarn:
```bash
yarn add play-cricket-client
```

## Import

ES Modules (recommended):
```typescript
import { Client } from "play-cricket-client";
```

CommonJS:
```javascript
const { Client } = require("play-cricket-client");
```

## Initialise

```typescript
const client = new Client(apiKey);
```

## Development

This project uses Bun for development. To get started:

```bash
# Install dependencies
bun install

# Run tests
bun test

# Run tests with coverage
bun test --coverage

# Watch mode
bun test --watch

# Build the project
bun run build

# Lint code
bun run lint

# Lint and fix auto-fixable issues
bun run lint:fix

# Format code
bun run format

# Run full check (lint + format)
bun run check

# Run full check and fix
bun run check:fix
```

