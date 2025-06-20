#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

class WeatherMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'weather-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_weather_2',
            description: 'Get current weather for a city',
            inputSchema: {
              type: 'object',
              properties: {
                city: {
                  type: 'string',
                  description: 'The city name',
                },
                units: {
                  type: 'string',
                  enum: ['celsius', 'fahrenheit'],
                  description: 'Temperature units',
                  default: 'celsius',
                },
              },
              required: ['city'],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        if (name === 'get_weather_2') {
          const { city, units = 'celsius' } = args as {
            city: string;
            units?: 'celsius' | 'fahrenheit';
          };

          if (!city || typeof city !== 'string') {
            throw new Error('City parameter is required and must be a string');
          }

          const weatherData = await this.getWeatherData(city, units);

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(weatherData, null, 2),
              },
            ],
          };
        }

        throw new Error(`Unknown tool: ${name}`);
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    });

    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'weather://cities',
            mimeType: 'application/json',
            name: 'Available Cities',
            description: 'List of cities with weather data',
          },
        ],
      };
    });

    // Handle resource reads
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      if (uri === 'weather://cities') {
        const cities = ['New York', 'London', 'Tokyo', 'Sydney', 'Paris'];
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(cities, null, 2),
            },
          ],
        };
      }

      throw new Error(`Unknown resource: ${uri}`);
    });
  }

  private async getWeatherData(city: string, units: 'celsius' | 'fahrenheit') {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Simulate weather data - replace with actual API call
    const baseTemp = Math.floor(Math.random() * 30) + 5;
    const temperature = units === 'fahrenheit'
      ? Math.round((baseTemp * 9/5) + 32)
      : baseTemp;

    const conditions = ['sunny', 'cloudy', 'rainy', 'snowy'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];

    return {
      city,
      temperature,
      units,
      condition,
      humidity: Math.floor(Math.random() * 40) + 30,
      windSpeed: Math.floor(Math.random() * 20) + 5,
      timestamp: new Date().toISOString(),
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    // Log to stderr so it doesn't interfere with MCP communication
    console.error('Weather MCP server running on stdio');
    console.error(`Process ID: ${process.pid}`);
    console.error(`Container: ${process.env.HOSTNAME || 'local'}`);
  }
}

// Start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new WeatherMCPServer();
  server.run().catch(console.error);
}

export default WeatherMCPServer;
