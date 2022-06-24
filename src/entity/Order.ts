import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn, JoinColumn, OneToOne, Unique, ManyToOne,

} from "typeorm";
import {IsEmail, Length, Min} from "class-validator";
import {Payment} from "./Payment";

import {OrderType} from "./OrderType";

import {OrderStatus} from "./OrderStatus";




@Entity()
@Unique(['payment'])
export class Order {
    //这个意思是自己增长
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    invoice: string;

    @Column('decimal',{precision: 10, scale:2})
    @Min(0)
    price: number;

    @Column('decimal',{precision: 5, scale:2, default:1.13})
    @Min(1)
    taxRate: number;

    @Column('decimal',{precision: 10, scale:2})
    @Min(0)
    total: number;

    @Column({
        type:"longtext"
    })
    orderItems: string;



    @Column({nullable:true,default:false})
    isStaff: boolean;

    @Column({nullable:true,default:false})
    isActive: boolean;

    @Column({nullable:true,default:false})
    isDelete: boolean;

    @Column()
    @IsEmail()
    @Length(5,150)
    userEmail:string;


    //这两行是设计的时候，忽略，但是加入的时候，默认必须要有的
    @Column()
    @CreateDateColumn()
    createAt:Date;

    @Column()
    @CreateDateColumn()
    updateAt:Date;


    @ManyToOne(()=>OrderType,type => type.orders)
    orderType: OrderType;

    @ManyToOne(()=>OrderStatus,type => type.orders)
    orderStatus: OrderStatus;

    @OneToOne(() => Payment)
    @JoinColumn()
    payment: Payment;
}
