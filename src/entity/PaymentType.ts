import {
    Entity,
    PrimaryGeneratedColumn,
    Column, Unique, OneToMany,

} from "typeorm";

import {Payment} from "./Payment";



@Entity()
@Unique(['type'])
export class PaymentType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @OneToMany(() => Payment,payment => payment.paymentType)
    payments:Payment[]

}