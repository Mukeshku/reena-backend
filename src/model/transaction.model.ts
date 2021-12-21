import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const TransactionSchema = new mongoose.Schema({
/*    resellerId: { type: String, required: true },
    createdAt: { type: String, required: true },
    status: { type: String, required: true },
    data: [{ type: Schema.Types.ObjectId, ref: 'Data' }]*/
});

const dataSchema =  new mongoose.Schema({
    id: { type: String, required: false},
    currency: { type: String, required: true },
    entityType: { type: String, required: true },
    items: [{ type: Schema.Types.Array, ref: 'Item' }],
    totalAmount: {type: Number, required: true},
    //items: Item[];
});

const itemSchema = new mongoose.Schema({
    brandId: {type: String, required: true},
    multiplier: {type: Number, required: true},
    productId: {type: String, required: true},
    retailPrice: {type: Number, required: true},
    quantity: {type: Number, required: true},
    sku: {type: String, required: true},
    brandName: {type: String, required: true},
    points: {type: Number, required: true},
    _id: {type: String, required: true}
})

const Data = mongoose.model('Data', dataSchema);
const Item = mongoose.model('Item',  itemSchema);

    export interface Item {
        brandId: string;
        multiplier: number;
        productId: string;
        retailPrice: number;
        quantity: number;
        sku: string;
        brandName: string;
        points: number;
        _id: string;
    }

    export interface Data {
        id: string;
        currency: string;
        entityType: string;
        items: Item[];
        totalAmount: number;
    }

    export interface Transactions {
        _id: string;
        data: Data;
        resellerId: string;
        createdAt: string;
        eventType: string;
        points: number;
        resId: string;
        status: string;
        tierId: string;
        updatedAt: string;
    }


