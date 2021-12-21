import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import {TransactionModule} from "./modules/transaction/transaction.module";
import {LookupModule} from "./modules/lookup/lookup.module";
const dotenv = require('dotenv');
dotenv.config()
@Module({
  imports: [
      TransactionModule,
      LookupModule,
      MongooseModule.forRoot(process.env.PROD_MONGO_URI)
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
