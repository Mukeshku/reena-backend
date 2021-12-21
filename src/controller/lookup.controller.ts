import {Body, Controller, Get, Post,} from '@nestjs/common';

import {LookUpService} from '../service/lookup.service';

@Controller('api/lookup')
export class LookupController {

    constructor(private readonly lookupService: LookUpService) {}

    @Post()
    async lookup(
        @Body('tierId') tierId: string,
        @Body('brandId') brandId: string,
        @Body('multiplier') multiplier: number
    ) {
        const generatedId = await this.lookupService.findProductByData(tierId, brandId, multiplier);
        return { id: generatedId };
    }

    @Get()
    async Lookup() {
        return await this.lookupService.getAll();
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
