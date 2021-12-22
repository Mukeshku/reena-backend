import {Body, Controller, ParseArrayPipe, Post, Req, Res,} from '@nestjs/common';

import {LookUpService} from '../service/lookup.service';
import {PointsDto} from '../model/Dto/PointsDto'
import {PointsDtoRes} from 'src/model/Dto/PointsDtoResponse';
import {Request, Response} from 'express';
import {getUniqueArray} from "../common/utils/generatedpointsUtils";
import {ApiBody} from "@nestjs/swagger";
import {CalulatePointsGenratedDTO} from "../model/Dto/CalulatePointsGenratedDTO";
import {EndPoints} from '../common/constants/endPoints'


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
                    value: [
                        {
                            "brandId": "2ea2ccd1-5c45-4900-acf8-eaf3b5a7c0c1",
                            "tierId": "bf645e97-8a48-4977-8367-e987489760f9",
                            "quantity": 1,
                            "retailPrice": 100
                        },
                        {
                            "brandId": "b7ece182-4936-47e2-8f94-153c2c77270b",
                            "tierId": "bf645e97-8a48-4977-8367-e987489760f9",
                            "quantity": 1,
                            "retailPrice": 7000
                        }
                    ] as [CalulatePointsGenratedDTO, CalulatePointsGenratedDTO]
                }
            }}
    )
    async calculatePoints(
        @Body(new ParseArrayPipe({items: PointsDto})) pointsDto: PointsDto[],
        @Req() request: Request,
        @Res() response: Response
    ) {
        let res: PointsDtoRes
        try {
            let points = 0;
            let promises = [];
            pointsDto.forEach(item => {
                promises.push(this.lookupService.findProductBrandAndTierId(item.brandId, item.tierId));
            });
            Promise.all(promises).then(results => {
                results = results.filter(i => i !== null);
                const uniqueArray = getUniqueArray(results);

                for (let j = 0; j < uniqueArray.length; j++) {
                    let flag = false;
                    const {multiplier} = results[j] || {};

                    pointsDto.forEach(pointsObj => {
                        const {quantity, retailPrice, brandId, tierId} = pointsObj || {}
                        if (uniqueArray[j].brandId === brandId && uniqueArray[j].tierId === tierId) {
                            points += Math.floor(multiplier * quantity * retailPrice);
                            flag = true;
                        }
                    })

                    if (!flag) {
                        break;
                    }
                }
                res = {"pointsGenerated": Math.floor(parseFloat(points.toFixed(2)))}
                return response.status(200).send({pointsGenerated: Math.floor(parseFloat(points.toFixed(2)))});
            }).catch(e => {
                return response.status(500).send({msg: "something went wrong" + e});
            });
        } catch (e) {
            return response.status(500).send({msg: "something went wrong" + e});
        }
    }
}
