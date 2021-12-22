import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

import {look_up_points} from '../model/lookup.model';

@Injectable()
export class LookUpService {
    constructor(@InjectModel('look_up_points') private readonly lookUpModel: Model<look_up_points>) {
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

     async getAll(): Promise<look_up_points> {
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
    async findOne(brandId: string,tierId: string): Promise<look_up_points> {
        console.log("items");
        let data:look_up_points;
        try {
            data = await this.lookUpModel.findOne({brandId,tierId})
        } catch (error) {
            throw new NotFoundException('Could not find product.');
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
            throw new NotFoundException('Could not find product.');
        }
        if (!product) {
            throw new NotFoundException('Could not find product.');
        }
        return product._id;
    }
    async findProductBrandAndTierId(brandId: string,tierId: string): Promise<look_up_points> {
        let product: look_up_points;
        try {
            product = await this.lookUpModel.findOne(
                {tierId, brandId});
        } catch (e) {
            throw new NotFoundException('Could not find product.');
        }
        if (!product) {
            throw new NotFoundException('Could not find product.');
        }
        console.log(product)
        return product;
    }
}
