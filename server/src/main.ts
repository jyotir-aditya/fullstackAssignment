import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enabling CORS for the frontend
  app.enableCors();

  app.setGlobalPrefix('api');
  
  // Use global validation pipe for DTO validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false, // Allow optional fields in UpdateProductDto
    transform: true,
  }));
  const port = process.env.PORT || 3000;
  
  await app.listen(port);
  console.log('Server running on http://localhost:3000');
}
bootstrap();
