import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

import {resellers} from '../model/reseller.model';

@Injectable()
export class ResellerService {
    constructor(@InjectModel('resellers') private readonly resellerModel: Model<resellers>) {
    }

     async getSummary(resellerId,req,res){
        try {
            console.log('Reseller id from URL is  ', resellerId , req.query);
            let resellerData: resellers = await this.findItemFromResellerId(resellerId);
            console.log('DATA from DB is ', resellerData);
            if (resellerData) {
                return res.status(200).send(resellerData);
            } else {
                return res.status(500).send({error: 'No reseller found'});
            }
        } catch (e) {
            return res.status(500).send({error: 'something went wrong'});
        }

     }

    async findProductResellerAndTierId(resellerId: string,tierId: string): Promise<resellers> {
        console.log("reseller",resellerId,tierId);
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
