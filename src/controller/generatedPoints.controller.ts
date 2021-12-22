import {Body, Controller, Get, ParseArrayPipe, Post,} from '@nestjs/common';

import {LookUpService} from '../service/lookup.service';
import {PointsDto} from '../model/Dto/PointsDto'
import {PointsDtoRes} from 'src/model/Dto/PointsDtoResponse';
import {Request, Response} from 'express';
import {Req, Res} from '@nestjs/common';
import {getUniqueArray} from "../common/utils/generatedpointsUtils";


@Controller('api/calculate-points-generated')
export class PointGeneratorController {

    constructor(private readonly lookupService: LookUpService) {
    }

    @Post()
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
