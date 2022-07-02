import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MongooseModule} from '@nestjs/mongoose';
import {TransactionModule} from "./modules/transaction.module";
import {LookupModule} from "./modules/lookup.module";
import {ResellerModule} from './modules/reseller.module';
import {LoggerMiddleware} from "./middleware/logger.middleware";
import { DeviceModule } from './device/device.module';
import { ScheduleModule } from '@nestjs/schedule';

const dotenv = require('dotenv');
dotenv.config()
@Module({
  imports: [
      TransactionModule,
      LookupModule,
      ResellerModule,
      DeviceModule,
      ScheduleModule.forRoot(),
      MongooseModule.forRoot(process.env.PROD_MONGO_URI)
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware)
            .forRoutes('*');
    }
}
