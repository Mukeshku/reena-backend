const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-double')(mongoose);

export const ResellerSchema = new Schema({
    _id: {type: Schema.Types.String},    
    resellerId: {type: Schema.Types.String},
    createdAt: {type: Schema.Types.Date},
    points: {type: mongoose.Types.Double},
    tierId: {type: Schema.Types.String},
    updatedAt: {type: Schema.Types.Date}
}, {timestamps: true, versionKey: false});

export interface resellers {
    _id: string;
    resellerId: string;
    createdAt: Date;
    points: number;
    tierId: string;
    updatedAt: Date;
}
