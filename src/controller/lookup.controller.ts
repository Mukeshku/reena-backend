import {Body, Controller, Get, Post,} from '@nestjs/common';

import {LookUpService} from '../service/lookup.service';
import {ApiBody} from "@nestjs/swagger";
import {LookUpControllerBodyDTO} from "../model/Dto/LookUpControllerBodyDTO";
import {EndPoints} from '../common/constants/endPoints'

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
                    value: {
                        "brandId" : "c74cfe28-6796-4d-ecc9f",
                        "multiplier" : 0.999999,
                        "tierId" : "bf645e97-8a48-4977-8367-e7489760f9"
                    } as LookUpControllerBodyDTO
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
