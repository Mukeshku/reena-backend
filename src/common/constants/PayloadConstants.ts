import {CalulatePointsGenratedDTO} from "../../model/Dto/CalulatePointsGenratedDTO";
import {LookUpControllerBodyDTO} from "../../model/Dto/LookUpControllerBodyDTO";
import {WebhooksAPIDTO} from "../../model/Dto/WebhooksAPIDTO";

export abstract class PayloadConstants {
    static readonly CALCULATED_GENERATED_POINTS_DTO_SAMPLE_PAYLOAD: [CalulatePointsGenratedDTO, CalulatePointsGenratedDTO] = [
        {
            "brandId": "2ea2ccd1-5c45-4900-acf8-eaf3b5a7c0c1",
            "tierId": "bf645e97-8a48-4977-8367-e987489760f9",
            "quantity": 1,
            "retailPrice": 100
        },
        {
            "brandId": "b7ece182-4936-47e2-8f94-153c2c77270b",
            "tierId": "bf645e97-8a48-4977-8367-e987489760f9",
            "quantity": 1,
            "retailPrice": 7000
        }
    ];

    static readonly LOOKUP_DTO_SAMPLE_PAYLOAD: LookUpControllerBodyDTO = {
        "brandId": "c74cfe28-6796-4d-ecc9f",
        "multiplier": 0.999999,
        "tierId": "bf645e97-8a48-4977-8367-e7489760f9"
    }

    static readonly WEBHOOKS_API_SAMPLE_PAYLOAD: WebhooksAPIDTO = {
        "type": "order_payment_done",
        "data": {
            "entity_type": "order",
            "id": "OD1639035692037433REG",
            "resellerInfo": {
                "id": "886fb0c8-a5a5-4daf-bf72-d00949b83188",
                "tierId": "07030fbe-5801-4318-9e97-fe33fa169894",
                "tierName": "tier_name1"
            },
            "items": [
                {
                    "brandId": "0f6d4519-ed6c-4c2a-9079-113bbe4a7e14",
                    "tierId": "bf645e97-8a48-4977-8367-e987489760f9",
                    "productId": "product_uuid1",
                    "retailPrice": 300,
                    "quantity": 3,
                    "sku": "sku_details1"
                },
                {
                    "brandId": "246a4647-c160-4353-b3ff-5c1bd0cd535b",
                    "tierId": "07030fbe-5801-4318-9e97-fe33fa169894",
                    "productId": "product_uuid2",
                    "retailPrice": 400,
                    "quantity": 2,
                    "sku": "sku_details2"
                }
            ]
        }
    }
}
