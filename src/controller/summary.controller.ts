import {Controller, Get, Param, Req, Res} from '@nestjs/common';
import {Request, Response} from 'express';
import {ResellerService} from '../service/reseller.service';
import {resellers} from "../model/reseller.model";
import {TransactionService} from 'src/service/transaction.service';
import {ApiParam} from "@nestjs/swagger";
import {EndPoints} from '../common/constants/endPoints'


@Controller(EndPoints.RESELLERS)
export class SummaryController {

    constructor(
        private readonly resellerService: ResellerService,
        private readonly transactionService: TransactionService
        ) {}

    @Get(EndPoints.SUMMARY)
    @ApiParam({name:'resellerId',
        required: true,
        description: 'Reseller unique identifier',
        schema: { oneOf: [{type: 'string'}]}
    })
    async summary(@Req() req: Request, @Res() res: Response, @Param('resellerId') resellerId) {
      return this.resellerService.getSummary(resellerId,res,req)
    }


    @Get(EndPoints.LOYALTY_TRANSACTIONS)
    @ApiParam({name:'resellerId',
        required: true,
        description: 'Reseller unique identifier',
        schema: { oneOf: [{type: 'string'}]}
    })
    async loyaltyTransactions(
        @Req() req: Request,
        @Res() res: Response,
        @Param('resellerId') resellerId
    ) {
       return this.transactionService.getLoyaltyTransaction(req,res,resellerId)
    }
}
async function getCount(resellerId:string,transactionService) {
    return transactionService.countResult(resellerId)
}
