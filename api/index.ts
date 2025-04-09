import { NestFactory } from "@nestjs/core";
import { AppModule } from "../server/src/app.module";
import { ValidationPipe } from "@nestjs/common";
import { Request, Response } from "express";

let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    try {
      const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'debug', 'log']
      });

      // Enhanced CORS configuration
      app.enableCors({
        origin: true, // This allows requests from any origin with credentials
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization']
      });
      
      app.setGlobalPrefix("api");

      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: false,
          transform: true,
        })
      );

      await app.init();
      cachedServer = app;
    } catch (error) {
      console.error('Failed to initialize NestJS app:', error);
      throw error;
    }
  }

  return cachedServer;
}

// Improved request handling for serverless environment
export default async (req: Request, res: Response) => {
  // Add detailed CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests immediately
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    console.log(`Request received: ${req.method} ${req.url}`);
    console.log('Request body:', req.body);
    
    const server = await bootstrap();
    
    // Process the request with NestJS
    await new Promise<void>((resolve, reject) => {
      server.getHttpAdapter().getInstance()(req, res, (err: any) => {
        if (err) {
          console.error('Express middleware error:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    
    // Only send response if not already sent
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ 
        statusCode: 500, 
        message: 'Internal Server Error',
        path: req.url,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
    }
  }
};
