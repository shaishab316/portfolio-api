import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { type Env, validateEnv } from './config/env.schema';
import { loadEnvironment } from './config/env.loader';
import { DrizzleModule } from '@nestjs/drizzle';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { AuthModule } from './auth/auth.module';

//! Load environment variables before NestJS initializes ConfigModule
loadEnvironment();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      validate: validateEnv,
    }),
    DrizzleModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => ({
        drizzle,
        connection: config.get('DATABASE_URL'),
      }),
    }),
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
