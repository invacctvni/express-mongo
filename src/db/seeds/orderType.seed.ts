import {Factory, Seeder} from "typeorm-seeding";
import {Connection, getRepository} from "typeorm";
import {OrderType} from "../../entity/OrderType";



export class OrderTypeSeed implements Seeder{
    public async run( factory: Factory, connection: Connection):Promise<void>{

        const repo = getRepository(OrderType)

        //payment status 1
        let orderType1 = new OrderType()
        orderType1.type = 'online'
        await repo.save(orderType1)


    }

}