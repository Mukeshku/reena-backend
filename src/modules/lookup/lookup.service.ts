import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

import {LookUp} from './lookup.model';

@Injectable()
export class LookUpService {
    constructor(@InjectModel('LookUp') private readonly lookUpModel: Model<LookUp>) {
    }

    /*  async insertProduct(title: string, desc: string, price: number) {
          const transactionsModel = new this.transactionsModel({
              title,
              description: desc,
              price,
          });
          const result = await transactionsModel.save();
          return result.id as string;
      }*/

    /* async getTransactions() {
         const transactions = await this.transactionsModel.find().exec();
         return JSON.stringify(transactions)
     }
 */
    /* async getSingleProduct(productId: string) {
           const product = await this.findProduct(productId);
           return {
               id: product.id,
               title: product.title,
               description: product.description,
               price: product.price,
           };
       }*/

    /*   async updateProduct(
           productId: string,
           title: string,
           desc: string,
           price: number,
       ) {
           const updatedProduct = await this.findProduct(productId);
           if (title) {
               updatedProduct.title = title;
           }
           if (desc) {
               updatedProduct.description = desc;
           }
           if (price) {
               updatedProduct.price = price;
           }
           updatedProduct.save();
       }

       async deleteProduct(prodId: string) {
           const result = await this.transactionsModel.deleteOne({_id: prodId}).exec();
           if (result.n === 0) {
               throw new NotFoundException('Could not find product.');
           }
       }

       */

     async getAll(): Promise<LookUp> {
        let data;
        try {
            data = await this.lookUpModel.find({})
        } catch (error) {
            throw new NotFoundException('Could not find product.');
        }
        if (!data) {
            throw new NotFoundException('Could not find product.');
        }
        return data;
    }

    async findProductByData(tierId: string, brandId: string, multiplier: Number): Promise<string> {
        let product: LookUp;
        try {
            product = await this.lookUpModel.findOneAndUpdate(
                {tierId, brandId, multiplier},
                {},
                {upsert: true, new: true});
        } catch (e) {
            throw new NotFoundException('Could not find product.');
        }
        if (!product) {
            throw new NotFoundException('Could not find product.');
        }
        return product._id;
    }
}
