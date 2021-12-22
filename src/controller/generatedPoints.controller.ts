import {Body, Controller, ParseArrayPipe, Post, Req, Res,} from '@nestjs/common';

import {LookUpService} from '../service/lookup.service';
import {PointsDto} from '../model/Dto/PointsDto'
import {PointsDtoRes} from 'src/model/Dto/PointsDtoResponse';
import {Request, Response} from 'express';
import {getUniqueArray} from "../common/utils/generatedpointsUtils";
import {ApiBody} from "@nestjs/swagger";
import {CalulatePointsGenratedDTO} from "../model/Dto/CalulatePointsGenratedDTO";
import {EndPoints} from '../common/constants/endPoints'
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
        @Req() request: Request,
        @Res() response: Response
    ) {
       return this.lookupService.calculatePoint(request,response,pointsDto)
    }
}
