import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
} from '@nestjs/common';

import { TransactionService } from '../service/transaction.service';

//todo ashish delete this controller
// Error handling
// Utilty in config
// Constant
// Code rectify
// Swagger
// Seperate mongodb connection


@Controller('api/transactions')
export class TransationController {

    constructor(private readonly transactionService: TransactionService) {}



    @Get('/lookup')
    async getAllProducts() {
        const transactions = await this.transactionService.getTransactions();
        return transactions;
    }
}
