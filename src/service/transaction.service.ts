import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

import {Transactions} from '../model/transaction.model';

@Injectable()
export class TransactionService {
    constructor(@InjectModel('Transactions') private readonly transactionsModel: Model<Transactions>) {}

    /*  async insertProduct(title: string, desc: string, price: number) {
          const transactionsModel = new this.transactionsModel({
              title,
              description: desc,
              price,
          });
          const result = await transactionsModel.save();
          return result.id as string;
      }*/

    async getTransactions() {
        const transactions = await this.transactionsModel.find().exec();
        return JSON.stringify(transactions)
    }

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

    private async findProduct(id: string): Promise<Transactions> {
         let product;
         try {
             product = await this.transactionsModel.findById(id).exec();
         } catch (error) {
             throw new NotFoundException('Could not find product.');
         }
         if (!product) {
             throw new NotFoundException('Could not find product.');
         }
         return product;
     }

    async findProductByData(tierId: string, brandId: string, multiplier: Number): Promise<Transactions> {
        let product;
        try {
            product = await this.transactionsModel.findOne({tierId, brandId, multiplier}).exec();
        } catch (error) {
            throw new NotFoundException('Could not find product.');
        }
        if (!product) {
            throw new NotFoundException('Could not find product.');
        }
        return product;
    }

}
