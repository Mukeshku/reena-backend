const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-double')(mongoose);

export const LookUpSchema = new Schema({
    brandId: {type: Schema.Types.String},
    tierId: {type: Schema.Types.String},
    multiplier: {type: mongoose.Types.Double}
}, {timestamps: true, versionKey: false});

export interface LookUp {
    _id: string;
    brandId: string;
    multiplier: number;
    tierId: string;
    __v: number;
}
