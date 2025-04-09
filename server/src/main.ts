import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure CORS with specific settings for Docker environment
  app.enableCors({
    origin: ["http://localhost", "http://localhost:80", "http://client"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  });

  app.setGlobalPrefix("api");

  // Use global validation pipe for DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false, // Allow optional fields in UpdateProductDto
      transform: true,
    })
  );

  const port = process.env.PORT || 3000;

  // Make sure server listens on 0.0.0.0 in Docker to accept connections from any IP
  await app.listen(port, "0.0.0.0");
  console.log(`Server running on http://0.0.0.0:${port}`);
}
bootstrap();
