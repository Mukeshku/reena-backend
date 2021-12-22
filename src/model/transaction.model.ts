const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-double')(mongoose);

export const TransactionSchema = new Schema({
    resId: {type: Schema.Types.String, trim: true, required: true},
    resellerId: {type: Schema.Types.String},
    eventType: {type: Schema.Types.String}, // type of event 'order.payment_done'
    tierId: Schema.Types.String,
    status: {type: Schema.Types.String, default: 'credited'},
    expiryDate: Schema.Types.Date,
    points: {type: Schema.Types.Number},
    data: {
        entityType: {type: Schema.Types.String}, // 'order'
        id: {type: Schema.Types.String}, // 'orderId
        currency: {type: Schema.Types.String},
        totalAmount: {type: mongoose.Types.Double},
        discountAmount: {type: mongoose.Types.Double},
        items: [{
            brandId: Schema.Types.String,
            multiplier: {type: mongoose.Types.Double},
            productId: Schema.Types.String,
            retailPrice: Schema.Types.Number,
            quantity: Schema.Types.Number,
            sku: Schema.Types.String,
            brandName: Schema.Types.String,
            points: Schema.Types.Number
        }]
    },

}, {timestamps: true, versionKey: false});

    export interface Item {
        brandId: string;
        multiplier: number;
        productId: string;
        retailPrice: number;
        quantity: number;
        sku: string;
        brandName: string;
        points: number;
    }

    export interface Data {
        id: string;
        currency: string;
        entityType: string;
        items: Item[];
        totalAmount: number;
    }

    export interface Transactions {
        data: Data;
        resellerId: string;
        eventType: string;
        points: number;
        resId: string;
        status: string;
        tierId: string;
    }

