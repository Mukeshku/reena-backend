import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TransationController } from './transation.controller';
import { TransactionService } from './transaction.service';
import { TransactionSchema } from './transaction.model';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Transactions', schema: TransactionSchema }])],
    controllers: [TransationController],
    providers: [TransactionService],
})
export class TransactionModule {}
