import { NestFactory } from "@nestjs/core";
import { toNodeHandler } from "better-auth/node";
import express from "express";

import { AppModule } from "./app.module";
import { AuthProvider } from "./auth/auth.provider";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  const auth = app.get(AuthProvider).auth;
  const server = app.getHttpAdapter().getInstance();

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  server.all("/api/auth/*path", toNodeHandler(auth));

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  await app.listen(process.env.PORT ?? 8000);

  console.log(`Server running at ${await app.getUrl()}`);
}

bootstrap();