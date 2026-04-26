import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FeedsModule } from './feeds/feeds.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '34.64.101.218',
      port: 3306,
      username: 'admin',
      password: '1234',
      database: 'twitter',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    FeedsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
