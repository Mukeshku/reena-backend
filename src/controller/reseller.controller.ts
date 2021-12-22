import {Controller, Post, Req, Res} from '@nestjs/common';
import {LookUpService} from 'src/service/lookup.service';
import {TransactionService} from 'src/service/transaction.service';
import {Request, Response} from 'express';
import {ResellerService} from '../service/reseller.service';
import {ApiBody} from "@nestjs/swagger";
import {WebhooksAPIDTO} from "../model/Dto/WebhooksAPIDTO";
import {EndPoints} from '../common/constants/endPoints'
import {PayloadConstants} from '../common/constants/PayloadConstants'


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
        console.log("re",req.body.data);

        try {
            if (!req.body.data.resellerInfo){
                 return res.status(404).send(   {message: 'Transaction not created since order has no reseller'});
            }
            const orderId = req.body.data.id || '';
            const resellerId = req.body.data.resellerInfo.id || '';
            const tierId = req.body.data.resellerInfo.tierId || '';
            const currency = req.body.data.currency || '';
            const entityType = req.body.data.entityType || '';
            const type = req.body.type || '';
            if (! await this.transactionService.countDocuments(resellerId,orderId)) {
                console.log("No Doc availablle");
                let reseller = await this.resellerService.findProductResellerAndTierId(resellerId, tierId);
                let transaction:any
                transaction = {
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
                        totalAmount:0,
                    },
                    points:0
                }
                let points = [];
                req.body.data.items.forEach((item) => {
                    points.push(getProductPoints(item, tierId,this.lookUpService));
                });
                const tempItems = await Promise.all(points);
                console.log("in before",tempItems);
                //check filter
                transaction.data.items = tempItems
                console.log("in after",transaction.data.items);
                let totalPoints = 0;
                let totalAmount = 0;
                transaction.data.items.forEach(i => {
                    totalPoints += i.points;
                    totalAmount += i.retailPrice;
                });
                transaction.points = totalPoints;
                transaction.data.totalAmount = parseFloat(totalAmount.toFixed(2));
                if (transaction.points <= 0){
                 return res.status(200).send({message: 'Transaction not created since order generated 0 points'});
                }

                this.transactionService.findOneAndUpdate(resellerId,orderId,transaction).then(data => {
                    // To-Do  Handle  req
                   // if (error){
                     //return res.status(500).send(error);
                    //}
                    this.resellerService.updateOne(resellerId,reseller.points + totalPoints).then(id => {
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
