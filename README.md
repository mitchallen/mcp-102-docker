# MCP Weather Server

A Model Context Protocol (MCP) server implementation for weather data services built with TypeScript.

**NOTE**: This demo returns ***mock*** weather data and ***not real data***.  To return live data is an exercise for the reader.

[![Ko-fi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/mitchallen)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/mitchallen)

## 🌤️ Overview

This project implements a weather server using the Model Context Protocol (MCP) SDK, providing standardized access to weather information through a well-defined interface.

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **TypeScript** knowledge for development

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd mcp-102-docker

# Install dependencies
npm install
# or using Makefile
make install
```

### Development

```bash
# Start development server with hot reload
npm run dev
# or
make dev

# Run in watch mode
npm run watch
# or
make watch
```

### Production

```bash
# Build the project
npm run build
# or
make build

# Start the server
npm start
# or
make start

# Build and start in one command
make start-prod
```

## 📦 Available Scripts

### NPM Scripts
- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run development server with tsx
- `npm start` - Start the compiled application
- `npm run watch` - Run with file watching for auto-restart
- `npm test` - Run the test suite

### Makefile Commands
Run `make help` to see all available commands:

#### Development
- `make dev` - Start development server with hot reload
- `make watch` - Run in watch mode
- `make build` - Build the project
- `make test` - Run tests
- `make typecheck` - Run TypeScript type checking

#### Maintenance
- `make clean` - Clean build artifacts
- `make clean-deps` - Clean node_modules
- `make reset` - Full reset (clean + reinstall + rebuild)
- `make verify` - Full verification pipeline

#### Utilities
- `make outdated` - Check for outdated packages
- `make update` - Update dependencies
- `make package` - Create distributable package

## 🏗️ Project Structure

```
mcp-102-docker/
├── src/
│   ├── docker-test.ts     # Docker integration/test script
│   ├── index.ts          # Main server entry point
│   └── test.ts           # Test suite
├── dist/                 # Compiled JavaScript output
├── node_modules/         # Dependencies
├── package.json          # Project configuration
├── package-lock.json     # NPM lockfile
├── tsconfig.json         # TypeScript configuration
├── Makefile              # Build and development commands
├── Dockerfile            # Docker build instructions
├── .dockerignore         # Docker ignore rules
├── .gitignore            # Git ignore rules
└── README.md             # Project documentation
```

## 🔧 Configuration

### TypeScript Configuration
The project uses TypeScript with ES modules. Configuration is in `tsconfig.json`.

### Package Configuration
- **Type**: ES Module (`"type": "module"`)
- **Main Entry**: `dist/index.js`
- **Binary**: `weather-server` command available after global install

## 🧪 Testing

```bash
# Run tests
npm test
# or
make test

# Run tests in watch mode
make test-watch
```

## 🖥️ Testing with Claude Desktop (Mac)

### Prerequisites
1. **Claude Desktop** installed on your Mac
2. **Built MCP server**: Run `make build` to compile your server

### Configuration Steps

1. **Build your server**:
   ```bash
   make build
   ```

2. **Locate Claude Desktop config**:

On a Mac, 

   * Claude > Settings > Developer > Edit Config

3. **Create or edit the config file**:

In the Finder file window, right click to edit this file in your preferred editor:

```sh
claude_desktop_config.json
```

4. **Add your MCP server configuration**:
   ```json
   {
     "mcpServers": {
       "weather-server": {
         "command": "node",
         "args": ["/absolute/path/to/your/mcp-102-docker/dist/index.js"],
         "env": {
           "NODE_ENV": "production"
         }
       }
     }
   }
   ```

   **Important**: Replace `/absolute/path/to/your/mcp-102-docker/` with your actual project path:
   ```bash
   # Get your current path
   pwd
   # Example result: /Users/username/projects/mcp/mcp-102-docker
   ```

5. **Alternative: Using npm global install**:
   ```bash
   # Install globally (after building)
   npm install -g .
   
   # Then use in config:
   {
     "mcpServers": {
       "weather-server": {
         "command": "weather-server"
       }
     }
   }
   ```

### Testing Steps

1. **Restart Claude Desktop** completely:
   ```bash
   # Quit Claude Desktop completely
   # Then relaunch from Applications
   ```

2. **Verify server connection**:
   - Open Claude Desktop
   - Look for MCP server indicators in the interface
   - Check for any error messages

3. **Test weather functionality**:
   - Ask Claude about weather in various locations
   - Try different weather-related queries
   - Verify the responses come from your MCP server

### Troubleshooting Claude Desktop Integration

#### Common Issues

1. **Server not connecting**:
   ```bash
   # Check if your server runs standalone
   node dist/index.js
   
   # Verify the path in config is correct
   ls -la /absolute/path/to/your/mcp-102-docker/dist/index.js
   ```

2. **Permission issues**:
   ```bash
   # Make sure the file is executable
   chmod +x dist/index.js
   ```

3. **Configuration file issues**:
   ```bash
   # Validate JSON syntax
   cat ~/Library/Application\ Support/Claude/claude_desktop_config.json | python3 -m json.tool
   ```

#### Debug Configuration

For debugging, you can add logging to your config:
```json
{
  "mcpServers": {
    "weather-server": {
      "command": "node",
      "args": ["/absolute/path/to/your/mcp-102-docker/dist/index.js"],
      "env": {
        "NODE_ENV": "development",
        "DEBUG": "mcp:*"
      }
    }
  }
}
```

#### Viewing Logs

1. **Claude Desktop logs**:
   ```bash
   # Check Console app for Claude Desktop logs
   # Or check system logs:
   log show --predicate 'process == "Claude Desktop"' --last 1h
   ```

2. **Your server logs**:
   - Add console.log statements to your `src/index.ts`
   - Rebuild with `make build`
   - Restart Claude Desktop

### Development Workflow with Claude Desktop

1. **Make changes** to your server code
2. **Rebuild**: `make build`
3. **Restart Claude Desktop** to reload the server
4. **Test** the changes in Claude Desktop
5. **Repeat** as needed

### Quick Setup Script

Create a setup script for easier testing:

```bash
# create setup-claude.sh
#!/bin/bash
echo "Building MCP server..."
make build

echo "Current project path:"
pwd

echo ""
echo "Add this to your Claude Desktop config:"
echo "~/Library/Application Support/Claude/claude_desktop_config.json"
echo ""
echo "{"
echo "  \"mcpServers\": {"
echo "    \"weather-server\": {"
echo "      \"command\": \"node\","
echo "      \"args\": [\"$(pwd)/dist/index.js\"]"
echo "    }"
echo "  }"
echo "}"
echo ""
echo "Then restart Claude Desktop to test!"
```

```bash
# Make it executable and run
chmod +x setup-claude.sh
./setup-claude.sh
```

## 🐳 Docker

### Prerequisites
- **Docker** installed
- **Trivy** (used automatically via Docker in Makefile for scanning)

### Build the Docker image
```bash
make docker-build
```

### Remove the Docker image
```bash
make docker-remove
```

### Scan the Docker image for vulnerabilities
```bash
make scan
```

## 🧪 Docker Integration Test

The file `src/docker-test.ts` is a script for testing the MCP server in a Dockerized environment. To run it:

```bash
npx tsx src/docker-test.ts
```

Or, if you want to run the compiled version:

```bash
node dist/docker-test.js
```

## 🛠️ Development Workflow

1. **Start Development**: `make dev`
2. **Make Changes**: Edit files in `src/`
3. **Test Changes**: `make test`
4. **Type Check**: `make typecheck`
5. **Build**: `make build`
6. **Verify**: `make verify` (runs full pipeline)

## 📚 Model Context Protocol (MCP)

This server implements the Model Context Protocol, which provides:
- Standardized communication between AI models and external systems
- Resource discovery and access patterns
- Tool invocation capabilities
- Structured data exchange

Learn more about MCP at the [official documentation](https://github.com/modelcontextprotocol).

## 🌐 Weather Server Features

This implementation provides weather-related functionality through the MCP interface, including:
- Weather data retrieval
- Location-based queries
- Standardized response formats

## 🔧 Adding Features

### Linting & Formatting (Optional)
To add code quality tools:

```bash
# Install ESLint
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Install Prettier
npm install --save-dev prettier

# Then use
make lint    # Lint code
make format  # Format code
```

## 📦 Building for Production

```bash
# Create production build
make build

# Create distributable package
make package

# Full verification before deployment
make verify
```

## 🔍 Troubleshooting

### Common Issues

1. **Build Errors**: Run `make clean` then `make build`
2. **Dependency Issues**: Run `make reset` to clean and reinstall
3. **Type Errors**: Run `make typecheck` to see detailed type issues

### Debugging

```bash
# Check project status
make git-status

# View what would be cleaned
make git-clean

# Check for outdated dependencies
make outdated
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run verification: `make verify`
5. Commit your changes: `git commit -am 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🔗 Links

- [Model Context Protocol](https://github.com/modelcontextprotocol)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 📧 Support

For issues and questions:
1. Check existing issues in the repository
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

---

Built with ❤️ using TypeScript and the Model Context Protocol