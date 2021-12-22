class ResellerInfo {
    id: string;
    tierId: string;
    tierName: string;
}

class Item {
    brandId: string;
    tierId: string;
    productId: string;
    retailPrice: number;
    quantity: number;
    sku: string;
}

class Data {
    entity_type: string;
    id: string;
    resellerInfo: ResellerInfo;
    items: Item[];
}


export class WebhooksAPIDTO {
    type: string;
    data: Data;
}
