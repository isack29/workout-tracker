import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";

import { AuthModule } from "./auth/auth.module";
import { UsersService } from "./users.service";
import { UsersControllers } from "./users.controller";

@Module({
    controllers: [UsersControllers],
    providers: [UsersService],
    imports: [PrismaModule, AuthModule], // 👈 Ahora usa AuthModule
    exports: [UsersService]
  })
  export class UsersModule {}