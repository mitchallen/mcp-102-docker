import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn, ChildProcess } from 'child_process';

class MCPTester {
  private client: Client;
  private transport!: StdioClientTransport;
  private serverProcess!: ChildProcess;

  constructor() {
    this.client = new Client(
      {
        name: 'test-client',
        version: '1.0.0',
      },
      {
        capabilities: {},
      }
    );
  }

  async connect() {
    // Create transport with command and args (the MCP SDK will handle process spawning)
    this.transport = new StdioClientTransport({
      command: 'tsx',
      args: ['src/index.ts'],
    });

    await this.client.connect(this.transport);
    console.log('✅ Connected to MCP server');
  }

  async testListTools() {
    console.log('\n🔧 Testing list tools...');
    const response = await this.client.listTools();
    console.log('Tools:', JSON.stringify(response, null, 2));
  }

  async testCallTool() {
    console.log('\n⚡ Testing tool call...');
    const response = await this.client.callTool({
      name: 'get_weather',
      arguments: {
        city: 'New York',
        units: 'celsius',
      },
    });
    console.log('Weather data:', JSON.stringify(response, null, 2));
  }

  async testListResources() {
    console.log('\n📚 Testing list resources...');
    const response = await this.client.listResources();
    console.log('Resources:', JSON.stringify(response, null, 2));
  }

  async testReadResource() {
    console.log('\n📖 Testing read resource...');
    const response = await this.client.readResource({
      uri: 'weather://cities',
    });
    console.log('Cities data:', JSON.stringify(response, null, 2));
  }

  async disconnect() {
    await this.client.close();
    console.log('✅ Disconnected from server');
  }
}

async function runTests() {
  const tester = new MCPTester();

  try {
    await tester.connect();
    await tester.testListTools();
    await tester.testCallTool();
    await tester.testListResources();
    await tester.testReadResource();
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await tester.disconnect();
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}
