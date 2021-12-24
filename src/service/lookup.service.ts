import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

import {look_up_points} from '../model/lookup.model';
import {PointsDtoRes} from 'src/model/Dto/PointsDtoResponse';
import {getUniqueArray} from "../common/utils/generatedpointsUtils";
import {AppConstants} from '../common/constants/AppConstants'
import {PointsDto} from '../model/Dto/PointsDto'
import { ErrorConstants } from 'src/common/constants/errorConstants';

@Injectable()
export class LookUpService {
    constructor(@InjectModel('look_up_points') private readonly lookUpModel: Model<look_up_points>) {
    }

    async calculatePoint(pointsDto){
        let res: PointsDtoRes
        try {
            let points = 0;
            let promises = [];
            pointsDto.forEach(item => {
                promises.push(this.findProductBrandAndTierId(item.brandId, item.tierId));
            });
            Promise.all(promises).then(results => {
                points = this.getPointsWrapper(results,pointsDto,points)
                res = {"pointsGenerated": Math.floor(parseFloat(points.toFixed(2)))}
                return res
            }).catch(e => {
                throw e
            });
        } catch (e) {
           throw e
        }
    }

    private getPointsWrapper(results: any,pointsDto: PointsDto[],points:number){

        results = results.filter(i => i !== null);
        const uniqueArray = getUniqueArray(results);
        for (let j = 0; j < uniqueArray.length; j++) {
            let flag = false;
            const {multiplier} = results[j] || {};
            ({ points, flag } = this.getsPoints(pointsDto, uniqueArray, j, points, multiplier, flag));
            if (!flag) {
                break;
            }
        }
        return points
    }

    private getsPoints(pointsDto: any, uniqueArray: PointsDto[], j: number, points: number, multiplier: any, flag: boolean) {
        pointsDto.forEach(pointsObj => {
            const { quantity, retailPrice, brandId, tierId } = pointsObj || {};
            if (uniqueArray[j].brandId === brandId && uniqueArray[j].tierId === tierId) {
                points += Math.floor(multiplier * quantity * retailPrice);
                flag = true;
            }
        });
        return { points, flag };
    }

     async getAll(): Promise<look_up_points> {
        let data;
        try {
            data = await this.lookUpModel.find({})
        } catch (error) {
            throw new NotFoundException(ErrorConstants.ERROR,ErrorConstants.ERROR_MESSAGE_SOMETING_WENT_WRONG);
        }
        if (!data) {
            throw new NotFoundException(ErrorConstants.ERROR,ErrorConstants.ERROR_RESELLER_NOT_FOUND);
        }
        return data;
    }
    async findProductByData(tierId: string, brandId: string, multiplier: Number): Promise<string> {
        let product: look_up_points;
        try {
            product = await this.lookUpModel.findOneAndUpdate(
                {tierId, brandId, multiplier},
                {},
                {upsert: true, new: true});
        } catch (e) {
            throw new NotFoundException(ErrorConstants.ERROR,ErrorConstants.ERROR_MESSAGE_SOMETING_WENT_WRONG);
        }
        if (!product) {
            throw new NotFoundException(ErrorConstants.ERROR,ErrorConstants.ERROR_RESELLER_NOT_FOUND);
        }
        return product._id;
    }
    async findProductBrandAndTierId(brandId: string,tierId: string): Promise<look_up_points> {
        let product: look_up_points;
        try {
            product = await this.lookUpModel.findOne(
                {tierId, brandId});
        } catch (e) {
            throw new NotFoundException(ErrorConstants.ERROR,ErrorConstants.ERROR_MESSAGE_SOMETING_WENT_WRONG);
        }
        if (!product) {
            throw new NotFoundException(ErrorConstants.ERROR,ErrorConstants.ERROR_BRAND_NOT_FOUND+" "+brandId);
        }
        return product;
    }
}
