import {Controller, Post, Req, Res} from '@nestjs/common';
import {LookUpService} from 'src/service/lookup.service';
import {TransactionService} from 'src/service/transaction.service';
import {Request, Response} from 'express';
import {ResellerService} from '../service/reseller.service';
import {ApiBody} from "@nestjs/swagger";
import {WebhooksAPIDTO} from "../model/Dto/WebhooksAPIDTO";
import {EndPoints} from '../common/constants/endPoints'
import {PayloadConstants} from '../common/constants/PayloadConstants'
import { resellers } from 'src/model/reseller.model';


@Controller(EndPoints.WEBHOOKS)
export class ResellerController {

    constructor(
        private readonly resellerService: ResellerService,
        private readonly transactionService: TransactionService,
        private readonly lookUpService: LookUpService
        ) {}

    @Post()
    @ApiBody(
        {type: WebhooksAPIDTO,
            description: "The Description for the Post Body. Please look into the DTO for more info.",
            examples: {
                a: {
                    summary: "Payload",
                    description: "Edit the body with actual data",
                    value: PayloadConstants.WEBHOOKS_API_SAMPLE_PAYLOAD as WebhooksAPIDTO
                }
            }}
    )
    async webhooks(
        @Req() req: Request,
        @Res() res: Response
    ) {
        
        try {
            if (!req.body.data.resellerInfo){
                 return res.status(404).send({message: 'Transaction not created since order has no reseller'});
            }
            const { resellerId, orderId, tierId, type, currency, entityType } = getRequestProperties(req);
            if (! await this.transactionService.countDocuments(resellerId,orderId)) {
                let reseller :any
                try{
                    reseller = await this.resellerService.findProductResellerAndTierId(resellerId, tierId);
                }catch(e){
                    return res.status(404).send({message: e});
                }
                let transaction:any
                transaction = getTransactionModel(type, reseller, tierId, req, orderId, currency, entityType)
                let points = [];
                req.body.data.items.forEach((item) => {
                    points.push(getProductPoints(item, tierId,this.lookUpService));
                });
                const tempItems = await Promise.all(points);
                transaction = updateTransactionWithPoints(transaction, tempItems);
                if (transaction.points <= 0){
                 return res.status(200).send({message: 'Transaction not created since order generated 0 points'});
                }
                this.transactionService.findOneAndUpdate(resellerId,orderId,transaction).then(data => {
                    this.resellerService.updateOne(resellerId,reseller.points +  transaction.points).then(id => {
                        return res.status(200).send({message: 'Transaction Successfully Saved', data: data});
                    })
                });
            } else {
                return res.status(200).send({message: 'Order already Saved'});
            }
        } catch (e) {
            return res.status(500).send({message: 'Internal server error', e});
        }
    }
}

function updateTransactionWithPoints(transaction: any, tempItems: any[]) {
    transaction.data.items = tempItems;
    let totalPoints = 0;
    let totalAmount = 0;
    transaction.data.items.forEach(item => {
        totalPoints += item.points;
        totalAmount += item.retailPrice;
    });
    transaction.points = totalPoints;
    transaction.data.totalAmount = parseFloat(totalAmount.toFixed(2));
    return transaction;
}

function getRequestProperties(req) {
    const orderId = req.body.data.id || '';
    const resellerId = req.body.data.resellerInfo.id || '';
    const tierId = req.body.data.resellerInfo.tierId || '';
    const currency = req.body.data.currency || '';
    const entityType = req.body.data.entityType || '';
    const type = req.body.type || '';
    return { resellerId, orderId, tierId, type, currency, entityType };
}

function getTransactionModel(type: any, reseller: resellers, tierId: any, req, orderId: any, currency: any, entityType: any): any {
    return {
        eventType: type === 'order_payment_done' ? 'order.payment_done' : type,
        resId: reseller._id,
        tierId,
        resellerId: req.body.data.resellerInfo.id,
        type: req.body.type,
        data: {
            id: orderId,
            currency: currency,
            entityType,
            items: Array,
            totalAmount: 0,
        },
        points: 0
    };
}

function getProductPoints(item, tierId,lookupService) {
    return new Promise((resolve, reject) => {
        lookupService.findOne(item.brandId, tierId).then((data, error) => {
            if (error) reject(error);
            item.points = Math.floor((data ? data.multiplier : 0) * item.quantity * item.retailPrice);
            if (data && data.multiplier) item.multiplier = data.multiplier;
            resolve(item);
        });
    });
}
