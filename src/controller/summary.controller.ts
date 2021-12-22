import {Controller, Get, Param, Req, Res} from '@nestjs/common';
import {Request, Response} from 'express';
import {ResellerService} from '../service/reseller.service';
import {resellers} from "../model/reseller.model";


@Controller('/api/resellers')
export class SummaryController {

    constructor(private readonly resellerService: ResellerService) {}

    @Get('/:id/summary')
    async summary(@Req() req: Request, @Res() res: Response, @Param('id') resellerId) {
        try {
            console.log('Reseller id from URL is  ', resellerId);
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
}
