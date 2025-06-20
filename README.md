# MCP Weather Server

A Model Context Protocol (MCP) server implementation for weather data services built with TypeScript.

**NOTE**: This demo returns ***mock*** weather data and ***not real data***.  To return live data is an exercise for the reader.

[![Ko-fi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/mitchallen)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/mitchallen)

## 🌤️ Overview

This project implements a weather server using the Model Context Protocol (MCP) SDK, providing standardized access to weather information through a well-defined interface.

## 📋 Prerequisites

- **Docker** (for running the server and integration tests)
- **Trivy** (used automatically via Docker in Makefile for scanning)

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd mcp-102-docker
```

### Docker Usage

#### Build the Docker image
```bash
make docker-build
```

#### Remove the Docker image
```bash
make docker-remove
```

#### Scan the Docker image for vulnerabilities
```bash
make scan
```

## 🧪 Docker Integration Test

The file `src/docker-test.ts` is a script for testing the MCP server in a Dockerized environment. To run it:

```bash
npx tsx src/docker-test.ts
```

## 🏗️ Project Structure

```
mcp-102-docker/
├── src/
│   ├── docker-test.ts     # Docker integration/test script
│   ├── index.ts           # Main server entry point
├── dist/                  # Compiled JavaScript output
├── node_modules/          # Dependencies
├── package.json           # Project configuration
├── package-lock.json      # NPM lockfile
├── tsconfig.json          # TypeScript configuration
├── Makefile               # Build and development commands
├── Dockerfile             # Docker build instructions
├── .dockerignore          # Docker ignore rules
├── .gitignore             # Git ignore rules
└── README.md              # Project documentation
```

## 🛠️ Development Workflow

1. **Make Changes**: Edit files in `src/`
2. **Test Changes**: `make test`
3. **Type Check**: `make typecheck`
4. **Build**: `make build`
5. **Verify**: `make verify` (runs full pipeline)

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

# View Claude Desktop logs (macOS only)
make logs-claude
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

## 🖥️ Using with Claude Desktop (Mac)

You can configure Claude Desktop to use the Dockerized MCP Weather Server as a custom MCP server.

### Steps

1. **Build the Docker image** (if you haven't already):
   ```bash
   make docker-build
   ```

2. **Open Claude Desktop Settings:**
   - Go to **Claude > Settings > Developer > Edit Config**

3. **Edit your Claude Desktop config file** (e.g., `claude_desktop_config.json`) and add or update the `mcpServers` section:
   ```json
   {
    "mcpServers": {
      "docker-server": {
        "command": "docker",
        "args": [
          "run",
          "-i",
          "--rm",
          "--name", "mcp-weather-server",
          "mcp-weather-server:latest"
        ],
        "env": {
          "DEBUG": "mcp:*"
        }
      }
    }
  }

   ```

4. **Save the config and restart Claude Desktop** to apply the changes.

5. Click on the **Search and Tools** button under the prompt

6. Under **docker-server** (the name in your config above) enable **get_weather_2**
   * If you had another weather tool enable (like from my previous example), disable it

5. **Test**: Ask Claude about the weather in various locations to verify the MCP server is being used.

**Note:**
- The Docker image must be built and available locally as `mcp-weather-server:latest`.
- The above config will run the server in a disposable container each time Claude Desktop starts it.

---

Built using TypeScript, Docker and the Model Context Protocol