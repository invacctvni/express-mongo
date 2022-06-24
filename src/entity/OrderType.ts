import {
    Entity,
    PrimaryGeneratedColumn,
    Column, Unique, OneToMany,

} from "typeorm";
import {IsEmail, Length, Min} from "class-validator";
import {Order} from "./Order";



@Entity()
@Unique(['type'])
export class OrderType {
    //这个意思是自己增长
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @OneToMany(() => Order,order => order.orderType)
    orders:Order[]

}