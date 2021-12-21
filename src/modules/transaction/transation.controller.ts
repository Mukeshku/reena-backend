import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
} from '@nestjs/common';

import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransationController {

    constructor(private readonly transactionService: TransactionService) {}

    @Post()
    async lookup(
        @Body('tierId') tierId: string,
        @Body('brandId') brandId: string,
        @Body('multiplier') multiplier: number
    ) {
        const generatedId = await this.transactionService.findProductByData(tierId, brandId, multiplier);
        return { id: generatedId };
    }

    @Get()
    async getAllProducts() {
        const transactions = await this.transactionService.getTransactions();
        return transactions;
    }

   /* @Get(':id')
    getProduct(@Param('id') prodId: string) {
        return this.transactionService.getSingleProduct(prodId);
    }*/

   /* @Patch(':id')
    async updateProduct(
        @Param('id') prodId: string,
        @Body('title') prodTitle: string,
        @Body('description') prodDesc: string,
        @Body('price') prodPrice: number,
    ) {
        await this.transactionService.updateProduct(prodId, prodTitle, prodDesc, prodPrice);
        return null;
    }

    @Delete(':id')
    async removeProduct(@Param('id') prodId: string) {
        await this.transactionService.deleteProduct(prodId);
        return null;
    }*/
}
