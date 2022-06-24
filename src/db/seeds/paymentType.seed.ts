import {Factory, Seeder} from "typeorm-seeding";
import {Connection, getRepository} from "typeorm";
import {PaymentType} from "../../entity/PaymentType";


export class PaymentTypeSeed implements Seeder{
    public async run( factory: Factory, connection: Connection):Promise<void>{

        const repo = getRepository(PaymentType)

        //payment status 1
        let paymentType1 = new PaymentType()
        paymentType1.type = 'paypal'
        await repo.save(paymentType1)

        //payment status 2
        let paymentType2 = new PaymentType()
        paymentType2.type = 'Visa'
        let p2 = await repo.save(paymentType2)

        //payment status 3
        let paymentType3 = new PaymentType()
        paymentType3.type = 'MasterCard'
        let p3 = await repo.save(paymentType3)

        //payment status 4
        let paymentType4 = new PaymentType()
        paymentType4.type = 'American Express'
        let p4 = await repo.save(paymentType4)

        //payment status 5
        let paymentType5 = new PaymentType()
        paymentType5.type = 'Discover'
        let p5 = await repo.save(paymentType5)

    }

}