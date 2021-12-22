import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

import {Transactions} from '../model/transaction.model';

@Injectable()
export class TransactionService {
    constructor(@InjectModel('transactions') private readonly transactionsModel: Model<Transactions>) {}

    async getLoyaltyTransaction(req,res,resellerId){
        try {
            let { skip, pagelimit, sType }: { skip: number; pagelimit: any; sType: number; } = this.validateRequest(req);
            let response =  await this.getPageResult(resellerId,skip,pagelimit,sType);
            if (response) {
                let total = await this.getCount(resellerId);
                let meta = {
                    hasNext: response.length * skip > total,
                    length: response.length,
                    total
                }
               return  res.status(200).json({data: response, meta});
            } else{
                return res.status(500).json({"msg":"error"});
            }

        } catch (e) {
            return res.status(500).json(e);
        }

    }
    private validateRequest(req: any) {
        let offset = req.query.page;
        let pagesize: any = req.query.pageSize;
        let sort = req.query.sort;
        let sType = 1;
        if (sort == "DESC") {
            sType = -1;
        }
        const pageOptions = {
            page: offset || 0,
            limit: parseInt(pagesize, 10) || 25
        };
        let pageFinal: any = pageOptions.page;
        let pagelimit: any = pageOptions.limit;
        let skip = pageFinal > 0 ? ((pageFinal - 1) * pageOptions.limit) : 0;
        return { skip, pagelimit, sType };
    }

    private async getCount(resellerId:string) {
        return this.countResult(resellerId)
    }
    async findOneAndUpdate(resellerId: string,orderId: string,transaction:any): Promise<any> {
        let product:any;
        console.log("in transacrtiona",transaction);
        try {
            product = await this.transactionsModel.findOneAndUpdate({
                resellerId,
                'data.id': orderId,
            }, transaction, {upsert: true, new: true}).exec();
        } catch (error) {
            console.log("error in transacrtiona",error);
            throw new NotFoundException('Could not find product.');
        }
        console.log("in transacrtiona");

        return product;
    }
    async countDocuments(resellerId: string,orderId:string): Promise<any> {
        console.log("transaction",resellerId,orderId);
        let count = 0;
        try {
            count = await this.transactionsModel.count({"resellerId":resellerId, 'data.id': orderId}).exec();
        } catch (error) {
            throw new NotFoundException('Could not find document.');
        }
        console.log(count);
        return count;
    }
    async countResult(resellerId: string): Promise<any> {
        console.log("transaction",resellerId);
        let count = 0;
        try {
            count = await this.transactionsModel.count({"resellerId":resellerId}).exec();
        } catch (error) {
            throw new NotFoundException('Could not find document.');
        }
        console.log(count);
        return count;
    }
    async getPageResult(resellerId: string, skip: number, limit: number,sType:any): Promise<any> {
        let product;
        try {
            product = await this.transactionsModel.find({resellerId},{}).skip(skip).limit(limit)
            .sort({createdAt: sType}).exec();
        } catch (error) {
            throw new NotFoundException('Could not find product.');
        }
        return product;
    }

}
