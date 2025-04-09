import { NestFactory } from "@nestjs/core";
import { AppModule } from "../server/src/app.module";
import { ValidationPipe } from "@nestjs/common";
import { Request, Response } from "express";

let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);

    app.enableCors();
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
  }

  return cachedServer;
}

export default async (req: Request, res: Response) => {
  const server = await bootstrap();
  server.getHttpAdapter().getInstance()(req, res);
};
