import {Body, Controller, Get, Post, Res,} from '@nestjs/common';

import {LookUpService} from '../service/lookup.service';
import {ApiBody} from "@nestjs/swagger";
import {LookUpControllerBodyDTO} from "../model/Dto/LookUpControllerBodyDTO";
import {EndPoints} from '../common/constants/EndPoints'
import {PayloadConstants} from '../common/constants/PayloadConstants'
import {Response} from 'express';


@Controller('/api/lookup')
export class LookupController {

    constructor(private readonly lookupService: LookUpService) {
    }

    @Post()
    @ApiBody(
        {
            type: LookUpControllerBodyDTO,
            description: "The Description for the Post Body. Please look into the DTO for more info.",
            examples: {
                a: {
                    summary: "Payload",
                    description: "Edit the body with actual data",
                    value: PayloadConstants.LOOKUP_DTO_SAMPLE_PAYLOAD as LookUpControllerBodyDTO
                }
            }
        }
    )
    async lookup(
        @Body('tierId') tierId: string,
        @Body('brandId') brandId: string,
        @Body('multiplier') multiplier: number,
        @Res() response: Response
    ) {
        try {
            const generatedId = await this.lookupService.findProductByData(tierId, brandId, multiplier);
            return response.status(200).json({id: generatedId});
        } catch (e) {
            const {message, error, statusCode} = e?.response || {}
            return response.status(statusCode).json({message, error});
        }
    }

    @Get()
    async Lookup(@Res() response: Response) {
        try {
            let res = await this.lookupService.getAll();
            return response.status(200).json(res);
        } catch (e) {
            const {message, error, statusCode} = e?.response || {}
            return response.status(statusCode).json({message, error});
        }
    }
}
