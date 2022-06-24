import {Factory, Seeder} from "typeorm-seeding";
import {Connection, getRepository} from "typeorm";
import {OrderStatus} from "../../entity/OrderStatus";
import {OrderStatusCode,OrderStatusStr} from "../../helper/OrderHelp"


export class OrderStatusSeed implements Seeder{
    public async run( factory: Factory, connection: Connection):Promise<void>{

        const repo = getRepository(OrderStatus)

        //payment status 1
        let orderStatus1 = new OrderStatus()
        orderStatus1.status = OrderStatusStr.PENDING
        await repo.save(orderStatus1)

        //payment status 2
        let orderStatus2 = new OrderStatus()
        orderStatus2.status = OrderStatusStr.COMPLETED
        let o2 = await repo.save(orderStatus2)

        //payment status 3
        let orderStatus3 = new OrderStatus()
        orderStatus3.status = OrderStatusStr.CANCEL
        let o3 = await repo.save(orderStatus3)

    }

}