import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {ResellerController} from '../controller/reseller.controller';
import { ResellerService } from '../service/reseller.service';
import { ResellerSchema } from '../model/reseller.model';
import { LookUpService } from 'src/service/lookup.service';
import { TransactionService } from 'src/service/transaction.service';
import { LookUpSchema } from 'src/model/lookup.model';
import { TransactionSchema } from 'src/model/transaction.model';
@Module({
    imports: [MongooseModule.forFeature([
    { name: 'resellers', schema: ResellerSchema },
    { name: 'look_up_points', schema: LookUpSchema },
    { name: 'transactions', schema: TransactionSchema}
    ])],
    controllers: [ResellerController],
    providers: [LookUpService,TransactionService,ResellerService],
})

export class ResellerModule {}
