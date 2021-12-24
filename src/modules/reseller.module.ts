import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {ResellerController} from '../controller/reseller.controller';
import { ResellerService } from '../service/reseller.service';
import { ResellerSchema } from '../model/reseller.model';
import {SummaryController} from "../controller/summary.controller";
import {LookUpSchema} from "../model/lookup.model";
import {TransactionSchema} from "../model/transaction.model";
import {LookUpService} from "../service/lookup.service";
import {TransactionService} from "../service/transaction.service";

@Module({
    imports: [MongooseModule.forFeature([
    { name: 'resellers', schema: ResellerSchema },
    { name: 'look_up_points', schema: LookUpSchema },
    { name: 'transactions', schema: TransactionSchema}
    ])],
    controllers: [ResellerController, SummaryController],
    providers: [LookUpService,TransactionService,ResellerService],
})

export class ResellerModule {}
