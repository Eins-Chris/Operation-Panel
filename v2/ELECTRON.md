# Operation Panel - Electron Desktop Application

This application can now run as a standalone desktop application using Electron framework.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## Development

To run the application in Electron during development:

```bash
# First, install dependencies
npm install

# Start the Vite dev server in one terminal
npm run dev

# In another terminal, start Electron
npm run electron:dev
```

The `electron:dev` script will:
- Launch the Electron window
- Load the app from the Vite dev server (http://localhost:5173)
- Open developer tools for debugging

## Building for Production

To build the application for production:

```bash
# Build the web app and create Electron distributables
npm run electron:build
```

This will:
1. Compile TypeScript and build the Vite app to the `docs` folder
2. Package the Electron app for your current platform
3. Create platform-specific installers in the `dist-electron` folder

### Platform-Specific Builds

The application supports building for multiple platforms:

- **Windows**: NSIS installer and portable executable
- **macOS**: DMG and ZIP archives
- **Linux**: AppImage, DEB, and RPM packages

## Running the Electron App

To run the Electron app in production mode (after building):

```bash
npm run electron:start
```

This will launch the Electron app loading the built files from the `docs` folder.

## Project Structure

```
.
├── electron/
│   ├── main.cjs         # Electron main process (CommonJS)
│   ├── preload.cjs      # Preload script for secure IPC (CommonJS)
│   └── config.cjs       # Shared configuration (CommonJS)
├── src/                 # React application source
├── docs/                # Built web application (Vite output)
└── dist-electron/       # Electron build output
```

## Configuration

The Electron configuration is defined in `package.json`:

- **appId**: com.operationpanel.app
- **productName**: Operation Panel
- **main**: electron/main.cjs (CommonJS module)

## Security

The Electron configuration follows best practices:
- `nodeIntegration: false` - Prevents Node.js APIs in renderer
- `contextIsolation: true` - Isolates preload scripts
- Preload script for secure communication between main and renderer processes

## Cross-Platform Support

This application is designed to work on:
- Windows (7 and higher)
- macOS (10.10 and higher)
- Linux (most distributions)

## Troubleshooting

### Issue: Electron window is blank
- Make sure you've run `npm run build` to create the production files
- Check that the `docs` folder exists and contains `index.html`

### Issue: Development mode doesn't load
- Ensure Vite dev server is running on port 5173
- Check that `npm run dev` is running before starting Electron

### Issue: Build fails
- Verify all dependencies are installed: `npm install`
- Try cleaning node_modules and reinstalling: `rm -rf node_modules && npm install`
