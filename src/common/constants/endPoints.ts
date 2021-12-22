export abstract class EndPoints {
    static readonly BASE: string = '/api';

    static readonly RESELLERS: string = this.BASE + '/resellers';
    static readonly CALCULATE_POINTS_GENERATED: string = this.BASE + '/calculate-points-generated'
    static readonly LOOKUP: string = this.BASE + '/lookup'
    static readonly WEBHOOKS: string = this.BASE + '/webhooks'

    static readonly SUMMARY: string = '/:resellerId/summary'
    static readonly LOYALTY_TRANSACTIONS: string = '/:resellerId/loyaltyTransactions'

}
