import {Body, Controller, Get, ParseArrayPipe, Post,} from '@nestjs/common';

import {LookUpService} from '../service/lookup.service';
import {PointsDto}  from  '../model/Dto/PointsDto'
import { PointsDtoRes } from 'src/model/Dto/PointsDtoResponse';
import { resolve } from 'path/posix';
import { rejects } from 'assert';




@Controller('api/calculate-points-generated')
export class PointGeneratorController {

    constructor(private readonly lookupService: LookUpService) {}

    @Post()
    async calculatePoints( @Body(new ParseArrayPipe({ items: PointsDto }))
    pointsDto: PointsDto[],   
    ) {
       // console.log(pointsDto);
        let res : PointsDtoRes
        try {
            let points = 0;
            let promises = [];
            pointsDto.forEach(item => {
                promises.push(this.lookupService.findProductBrandAndTierId(item.brandId,item.tierId));
            });
            Promise.all(promises).then(results => {
                results = results.filter(i => i !== null);
                const uniqueArray = results.filter((result, index) => {
                    const _result = JSON.stringify(result);
                    return index === results.findIndex(obj => {
                      return JSON.stringify(obj) === _result;
                    });
                });
              //  console.log("==========",uniqueArray)
                for (let j = 0; j < uniqueArray.length; j++) {
                    let flag = false;
                    const {multiplier} = results[j]
                    for (let i = 0; i < pointsDto.length; i++) {
                        const {quantity,retailPrice} = pointsDto[i]
                        console.log(multiplier,quantity,retailPrice)
                        if (uniqueArray[j].brandId === pointsDto[i].brandId && uniqueArray[j].tierId === pointsDto[i].tierId) {
                            points += Math.floor(multiplier * quantity * retailPrice);
                            flag = true;
                        }
                    }
                    if (!flag) {
                        break;
                    }
                }
              // let response = new Promise<PointsDto>((resolve,reject) =>{
                res ={"pointsGenerated": Math.floor(parseFloat(points.toFixed(2)))}
                //})
                return res
            }).catch(e => {
               console.log("s222"+e)
                return {msg : "something went wrong"+e};
            });
        } catch (e) {
            console.log(e)
            return {pointsGenerated: 0}
        }
    }
}
