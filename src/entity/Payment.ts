import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn, OneToOne, JoinColumn, ManyToOne,

} from "typeorm";
import {IsEmail, Length, Min} from "class-validator";

import {PaymentStatus} from "./PaymentStatus";
import {PaymentType} from "./PaymentType";

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:true})
    @IsEmail()
    email:string;


    @Column({nullable:true})
    name: string;

    @Column({nullable:true})
    shippingAddress: string

    @Column({nullable:true})
    billingAddress: string

    @Column()
    @CreateDateColumn()
    createAt:Date

    @Column()
    @CreateDateColumn()
    updateAt:Date


    @ManyToOne(()=>PaymentStatus,status => status.payments)
    paymentStatus: PaymentStatus;



    @ManyToOne(()=>PaymentType,type => type.payments)
    paymentType: PaymentType;



}