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
      args: ['run', '-i', '--rm', 'mcp-weather-server'],
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
        name: 'get_weather_2', // Use the correct tool name
        arguments: { city, units: 'celsius' },
      });
      if (
        response &&
        Array.isArray((response as any).content) &&
        (response as any).content.length > 0 &&
        typeof (response as any).content[0].text === 'string'
      ) {
        const text = (response as any).content[0].text;
        try {
          const parsed = JSON.parse(text);
          console.log(`Weather for ${city}:`, parsed.condition);
        } catch (e) {
          console.warn(`Non-JSON response for city: ${city}:`, text);
        }
      } else {
        console.warn(`No valid content for city: ${city}`);
      }
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
    // Ensure process exits after disconnect
    process.exit(0);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runDockerTests();
}
