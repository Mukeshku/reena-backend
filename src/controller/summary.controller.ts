import {Controller, Get, Param, Req, Res} from '@nestjs/common';
import {Request, Response} from 'express';
import {ResellerService} from '../service/reseller.service';
import {ApiParam} from "@nestjs/swagger";
import {EndPoints} from '../common/constants/EndPoints'
import {TransactionService} from "../service/transaction.service";


@Controller('/api/resellers')
export class SummaryController {

    constructor(
        private readonly resellerService: ResellerService,
        private readonly transactionService: TransactionService
    ) {
    }

    @Get('/:resellerId/summary')
    @ApiParam({
        name: 'resellerId',
        required: true,
        description: 'Reseller unique identifier',
        schema: {oneOf: [{type: 'string'}]}
    })
    async summary(@Req() req: Request, @Res() res: Response, @Param('resellerId') resellerId) {
        try {
            let resellerData = await this.resellerService.getSummary(resellerId)
            return res.status(200).send(resellerData);
        } catch (e) {
            const {message, error, statusCode} = e?.response || {}
            return res.status(statusCode).json({message, error});
        }
    }


    @Get('/:resellerId/loyaltyTransactions')
    @ApiParam({
        name: 'resellerId',
        required: true,
        description: 'Reseller unique identifier',
        schema: {oneOf: [{type: 'string'}]}
    })
    async loyaltyTransactions(
        @Req() req: Request,
        @Res() res: Response,
        @Param('resellerId') resellerId,
    ) {
        try {
            let result = await this.transactionService.getLoyaltyTransaction(req, resellerId)
            return res.status(200).json(result);
        } catch (e) {
            const {message, error, statusCode} = e?.response || {}
            return res.status(statusCode).json({message, error});

        }
    }
}

