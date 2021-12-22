import {Body, Controller, Get, Post,} from '@nestjs/common';

import {LookUpService} from '../service/lookup.service';
import {ApiBody} from "@nestjs/swagger";
import {LookUpControllerBodyDTO} from "../model/Dto/LookUpControllerBodyDTO";
import {EndPoints} from '../common/constants/endPoints'
import {PayloadConstants} from '../common/constants/PayloadConstants'


@Controller(EndPoints.LOOKUP)
export class LookupController {

    constructor(private readonly lookupService: LookUpService) {}

    @Post()
    @ApiBody(
        {type: LookUpControllerBodyDTO,
            description: "The Description for the Post Body. Please look into the DTO for more info.",
            examples: {
                a: {
                    summary: "Payload",
                    description: "Edit the body with actual data",
                    value: PayloadConstants.LOOKUP_DTO_SAMPLE_PAYLOAD as LookUpControllerBodyDTO
                }
            }}
    )
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
}
