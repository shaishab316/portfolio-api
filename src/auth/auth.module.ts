import { Module } from "@nestjs/common";
import { AuthProvider } from "./auth.provider";

@Module({
  providers: [AuthProvider],
  exports: [AuthProvider],
})
export class AuthModule {}