import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {TransactionService} from '../service/transaction.service';
import {TransactionSchema} from '../model/transaction.model';

@Module({
 imports: [MongooseModule.forFeature([
     { name: 'transactions', schema: TransactionSchema },
    ])],
    controllers: [] ,
    providers: [TransactionService],
})
export class TransactionModule {}
