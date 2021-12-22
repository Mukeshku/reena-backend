import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {LookupController} from '../controller/lookup.controller';
import {LookUpService} from '../service/lookup.service';
import {LookUpSchema} from '../model/lookup.model';
import {PointGeneratorController} from '../controller/generatedPoints.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'look_up_points', schema: LookUpSchema }])],
    controllers: [LookupController,PointGeneratorController],
    providers: [LookUpService],
})

export class LookupModule {}
