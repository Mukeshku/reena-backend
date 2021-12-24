import {Body, Controller, ParseArrayPipe, Post, Req, Res,} from '@nestjs/common';

import {LookUpService} from '../service/lookup.service';
import {PointsDto} from '../model/Dto/PointsDto'
import {Request, Response} from 'express';
import {ApiBody} from "@nestjs/swagger";
import {CalulatePointsGenratedDTO} from "../model/Dto/CalulatePointsGenratedDTO";
import {EndPoints} from '../common/constants/EndPoints'
import {AppConstants} from '../common/constants/AppConstants'
import {PayloadConstants} from '../common/constants/PayloadConstants'


@Controller(EndPoints.CALCULATE_POINTS_GENERATED)
export class PointGeneratorController {

    constructor(private readonly lookupService: LookUpService) {
    }


    @Post()
    @ApiBody(
        {type: CalulatePointsGenratedDTO,
            description: "The Description for the Post Body. Please look into the DTO for more info.",
            examples: {
                a: {
                    summary: "Payload",
                    description: "Edit the body with actual data",
                    value: PayloadConstants.CALCULATED_GENERATED_POINTS_DTO_SAMPLE_PAYLOAD as [CalulatePointsGenratedDTO, CalulatePointsGenratedDTO]
                }
            }}
    )
    async calculatePoints(
        @Body(new ParseArrayPipe({items: PointsDto})) pointsDto: PointsDto[],
        @Res() response: Response
    ) {
        try{
        let res = this.lookupService.calculatePoint(pointsDto)
        return  response.status(200).json(res);
        }catch(e){
            const {message,error,statusCode} =  e?.response || {}
            return response.status(statusCode).json({"message":message,"error":error});
        }
    }
}
