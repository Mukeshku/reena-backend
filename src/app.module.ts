import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import {TransactionModule} from "./modules/transaction.module";
import {LookupModule} from "./modules/lookup.module";
import { ResellerModule } from './modules/reseller.module';
const dotenv = require('dotenv');
dotenv.config()
@Module({
  imports: [
      TransactionModule,
      LookupModule,
      ResellerModule,
      MongooseModule.forRoot(process.env.PROD_MONGO_URI)
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
