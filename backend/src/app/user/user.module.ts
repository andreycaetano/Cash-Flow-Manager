import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserPermissionMiddleware } from './middlewares/userPermission.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(UserPermissionMiddleware)
    .forRoutes(
      { path: 'user/:id', method: RequestMethod.DELETE},
      { path: 'user/:id', method: RequestMethod.POST},
      { path: 'user/:id', method: RequestMethod.PATCH}
    )
  }
}
