import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {TransationController} from '../controller/transation.controller';
import {TransactionService} from '../service/transaction.service';
import {TransactionSchema} from '../model/transaction.model';

@Module({
 imports: [MongooseModule.forFeature([
     { name: 'transactions', schema: TransactionSchema },
    ])],
    controllers: [TransationController] ,
    providers: [TransactionService],
})
export class TransactionModule {}
