import {Body, Controller, ParseArrayPipe, Post, Res,} from '@nestjs/common';

import {LookUpService} from '../service/lookup.service';
import {PointsDto} from '../model/Dto/PointsDto'
import {Response} from 'express';
import {ApiBody} from "@nestjs/swagger";
import {CalulatePointsGenratedDTO} from "../model/Dto/CalulatePointsGenratedDTO";
import {PayloadConstants} from '../common/constants/PayloadConstants'
import {EndPoints} from "../common/constants/endPoints";


@Controller('/api/calculate-points-generated')
export class PointGeneratorController {

    constructor(private readonly lookupService: LookUpService) {
    }

    @Post()
    @ApiBody(
        {
            type: CalulatePointsGenratedDTO,
            description: "The Description for the Post Body. Please look into the DTO for more info.",
            examples: {
                a: {
                    summary: "Payload",
                    description: "Edit the body with actual data",
                    value: PayloadConstants.CALCULATED_GENERATED_POINTS_DTO_SAMPLE_PAYLOAD as [CalulatePointsGenratedDTO, CalulatePointsGenratedDTO]
                }
            }
        }
    )
    async calculatePoints(
        @Body(new ParseArrayPipe({items: PointsDto})) pointsDto: PointsDto[],
        @Res() response: Response
    ) {
        return await this.lookupService.calculatePoint(pointsDto, response)

    }
}
