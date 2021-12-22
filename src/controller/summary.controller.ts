import {Controller, Get, Param, Req, Res} from '@nestjs/common';
import {Request, Response} from 'express';
import {ResellerService} from '../service/reseller.service';
import {resellers} from "../model/reseller.model";
import { TransactionService } from 'src/service/transaction.service';
import {ApiParam} from "@nestjs/swagger";


@Controller('/api/resellers')
export class SummaryController {

    constructor(
        private readonly resellerService: ResellerService,
        private readonly transactionService: TransactionService
        ) {}

    @Get('/:resellerId/summary')
    @ApiParam({name:'resellerId',
        required: true,
        description: 'Reseller unique identifier',
        schema: { oneOf: [{type: 'string'}]}
    })
    async summary(@Req() req: Request, @Res() res: Response, @Param('resellerId') resellerId) {
        try {
            console.log('Reseller id from URL is  ', resellerId , req.query);
            let resellerData: resellers = await this.resellerService.findItemFromResellerId(resellerId);
            console.log('DATA from DB is ', resellerData);

            if (resellerData) {
                return res.status(200).send(resellerData);
            } else {
                return res.status(500).send({error: 'No reseller found'});
            }
        } catch (e) {
            return res.status(500).send({error: 'something went wrong'});
        }
    }


    @Get('/:resellerId/loyaltyTransactions')
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
        try {
            let offset = req.query.page;
            let pagesize:any = req.query.pageSize;
            let sort = req.query.sort;
            let sType = 1;
            if(sort == "DESC"){
                sType = -1;
            }
            const pageOptions = {
                page: offset || 0,
                limit: parseInt(pagesize, 10) || 25
            };
           let pageFinal : any = pageOptions.page;
           let pagelimit : any = pageOptions.limit;
           let skip = pageFinal > 0 ? ((pageFinal - 1) * pageOptions.limit) : 0;
            let response =  await this.transactionService.getPageResult(resellerId,skip,pagelimit,sType);

            if (!response) {
                return res.status(500).json({"msg":"error"});
            }
            if (response) {
                let total = await getCount(resellerId,this.transactionService);
                let meta = {
                    hasNext: response.length * skip > total,
                    length: response.length,
                    total
                }
                res.status(200).json({data: response, meta});
            } else {
                res.status(200).json([]);
            }

        } catch (e) {
            return res.status(500).json(e);
        }
    }
}
async function getCount(resellerId:string,transactionService) {
    return transactionService.countResult(resellerId)
}
