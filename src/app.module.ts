import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import {TransactionModule} from "./modules/transaction/transaction.module";
import {LookupModule} from "./modules/lookup/lookup.module";

@Module({
  imports: [
      TransactionModule,
      LookupModule,
      MongooseModule.forRoot('mongodb+srv://admin:admin@cluster0.3ldeb.mongodb.net/stageRaenaDB?retryWrites=true&w=majority')
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
