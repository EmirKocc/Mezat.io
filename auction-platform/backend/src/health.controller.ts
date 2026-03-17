import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(
    @InjectConnection()
    private readonly mongoConnection: Connection,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHealth() {
    return {
      status: 'ok',
      mongo: {
        readyState: this.mongoConnection.readyState,
        dbName:
          this.mongoConnection.db?.databaseName ??
          this.configService.get<string>('database.mongodbDbName'),
        uri: this.configService.get<string>('database.mongodbUri'),
      },
    };
  }
}
