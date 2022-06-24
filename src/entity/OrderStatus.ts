
import {
    Entity,
    PrimaryGeneratedColumn,
    Column, Unique, OneToMany,

} from "typeorm";

import {Order} from "./Order";



@Entity()
@Unique(['status'])
export class OrderStatus {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: string;

    @OneToMany(() => Order,order => order.orderStatus)
    orders:Order[]

}