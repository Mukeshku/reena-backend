import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {LookupController} from './lookup.controller';
import { LookUpService } from './lookup.service';
import { LookUpSchema } from './lookup.model';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'LookUp', schema: LookUpSchema }])],
    controllers: [LookupController],
    providers: [LookUpService],
})

export class LookupModule {}
