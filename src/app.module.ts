import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Community,PointsCommunitiesMid,Point } from './entities/community.entity'
import { CommunityModule } from './community/community.module';


@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
  }),
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT) || 3306,
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: [Community,PointsCommunitiesMid,Point],
    synchronize: true,
  }),
  CommunityModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
