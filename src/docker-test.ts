import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

class DockerMCPTester {
  private client: Client;
  private transport!: StdioClientTransport;

  constructor() {
    this.client = new Client(
      {
        name: 'docker-test-client',
        version: '1.0.0',
      },
      {
        capabilities: {},
      }
    );
  }

  async connect() {
    // Connect to dockerized MCP server
    this.transport = new StdioClientTransport({
      command: 'docker',
      args: ['run', '-i', '--rm', 'weather-mcp-server'],
    });

    await this.client.connect(this.transport);
    console.log('✅ Connected to dockerized MCP server');
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
        city: 'Tokyo',
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

  async testMultipleRequests() {
    console.log('\n🔄 Testing multiple requests...');

    const cities = ['New York', 'London', 'Paris'];
    for (const city of cities) {
      const response = await this.client.callTool({
        name: 'get_weather',
        arguments: { city, units: 'celsius' },
      });
      console.log(`Weather for ${city}:`, JSON.parse(response.content[0].text).condition);
    }
  }

  async disconnect() {
    await this.client.close();
    console.log('✅ Disconnected from server');
  }
}

async function runDockerTests() {
  const tester = new DockerMCPTester();

  try {
    await tester.connect();
    await tester.testListTools();
    await tester.testCallTool();
    await tester.testListResources();
    await tester.testReadResource();
    await tester.testMultipleRequests();
  } catch (error) {
    console.error('❌ Docker test failed:', error);
  } finally {
    await tester.disconnect();
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runDockerTests();
}
