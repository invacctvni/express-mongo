import {Factory, Seeder} from "typeorm-seeding";
import {Connection, getRepository} from "typeorm";
import {PaymentStatus} from "../../entity/PaymentStatus";

export class PaymentStatusSeed implements Seeder{
    public async run( factory: Factory, connection: Connection):Promise<void>{

        const repo = getRepository(PaymentStatus)

        //payment status 1
        let paymentStatus1 = new PaymentStatus()
        paymentStatus1.status = 'pending'
        await repo.save(paymentStatus1)

        //payment status 2
        let paymentStatus2 = new PaymentStatus()
        paymentStatus2.status = 'completed'
        let p2 = await repo.save(paymentStatus2)

        //payment status 3
        let paymentStatus3 = new PaymentStatus()
        paymentStatus3.status = 'cancel'
        let p3 = await repo.save(paymentStatus3)
    }

}