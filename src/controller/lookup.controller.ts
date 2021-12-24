import {Body, Catch, Controller, Get, Post, Req, Res,} from '@nestjs/common';

import {LookUpService} from '../service/lookup.service';
import {ApiBody} from "@nestjs/swagger";
import {LookUpControllerBodyDTO} from "../model/Dto/LookUpControllerBodyDTO";
import {EndPoints} from '../common/constants/EndPoints'
import {PayloadConstants} from '../common/constants/PayloadConstants'
import {Request, Response} from 'express';


@Controller(EndPoints.LOOKUP)
export class LookupController {

    constructor(private readonly lookupService: LookUpService) {}

    @Post()
    @ApiBody(
        {type: LookUpControllerBodyDTO,
            description: "The Description for the Post Body. Please look into the DTO for more info.",
            examples: {
                a: {
                    summary: "Payload",
                    description: "Edit the body with actual data",
                    value: PayloadConstants.LOOKUP_DTO_SAMPLE_PAYLOAD as LookUpControllerBodyDTO
                }
            }}
    )
    async lookup(
        @Body('tierId') tierId: string,
        @Body('brandId') brandId: string,
        @Body('multiplier') multiplier: number,
        @Res() response: Response
    ) {
        try{
            const generatedId = await this.lookupService.findProductByData(tierId, brandId, multiplier);
            return { id: generatedId };
        }catch(e){
            const {message,error,statusCode} =  e?.response || {}
            return response.status(statusCode).json({"message":message,"error":error});
        }
    }

    @Get()
    async Lookup(@Res() response: Response) {
        try{
            return await this.lookupService.getAll();
        }catch(e){
            const {message,error,statusCode} =  e?.response || {}
            return response.status(statusCode).json({"message":message,"error":error}); 
        }
    }
}
