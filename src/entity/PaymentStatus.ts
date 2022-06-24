import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn, JoinColumn, OneToOne, Unique, OneToMany,

} from "typeorm";
import {IsEmail, Length, Min} from "class-validator";
import {Payment} from "./Payment";

@Entity()
@Unique(['status'])
export class PaymentStatus {
    //这个意思是自己增长
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: string;

    @OneToMany(() => Payment,payment => payment.paymentStatus)
    payments:Payment[]



}
