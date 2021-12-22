import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

import {resellers} from '../model/reseller.model';

@Injectable()
export class ResellerService {
    constructor(@InjectModel('resellers') private readonly resellerModel: Model<resellers>) {
    }

     async getAll(): Promise<resellers> {
        let data;
        try {
            data = await this.resellerModel.find({})
        } catch (error) {
            throw new NotFoundException('Could not find reseller.');
        }
        if (!data) {
            throw new NotFoundException('Could not find reseller.');
        }
        return data;
    }

    async findProductResellerAndTierId(resellerId: string,tierId: string): Promise<resellers> {
        console.log("reseler",resellerId,tierId);
        let product: resellers;
        try {
            product = await this.resellerModel.findOneAndUpdate(
                {tierId, resellerId},{upsert: true, new: true});
        } catch (e) {
            throw new NotFoundException('Could not find reseller.');
        }
        if (!product) {
            throw new NotFoundException('Could not find reseller.');
        }
        console.log(product)
        return product;
    }
    async updateOne(resellerId: string,totalPoints: number): Promise<any> {
        let product:any;
        try {
            product = await this.resellerModel.updateOne(
                {resellerId},
                {
                    $set: {"points": totalPoints},
                })
        } catch (e) {
            throw new NotFoundException('Could not find reseller.');
        }
        if (!product) {
            throw new NotFoundException('Could not find reseller.');
        }
        console.log(product)
        return product;
    }

    async findItemFromResellerId(resellerId :String): Promise<resellers>{
        let product: resellers;
        try {
            product = await this.resellerModel.findOne(
                {resellerId},
                {_id: 1, points: 1, resellerId: 1, tierId: 1}) // Projection is required to filter DATA.
        } catch (error) {
            throw new NotFoundException('Could not find product.');
        }
        return product;
    }
}
