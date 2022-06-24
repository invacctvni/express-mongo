import {getRepository, LessThan, MoreThan} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Order} from "../entity/Order";
import {IdCheckRes, MkController} from "./MKController";
import {Err, ErrStr, HttpCode} from "../helper/Err";

import {validate} from "class-validator";
import {OrderStatusController} from "./OrderStatusController";

import {OrderTypeController} from "./OrderTypeController";
import {PaymentController} from "./PaymentController";
import {OrderMode, OrderStatusCode} from "../helper/OrderHelp";



export class OrderController extends MkController{

    public static get repo(){
        return getRepository(Order)
    }


    static async all(request: Request, response: Response, next: NextFunction) {

        let {mode,email} = request.headers
        let orders:Order[] = []


        //fetch all product
        if(mode === OrderMode.HALF_YEAR){


            let curDate = (new Date()).getTime();
            let halfYear = 365 / 2 * 24 * 3600 * 1000;
            let pastResult = curDate - halfYear;

            const client = require('redis').createClient();

            client.on('error', (err) => console.log('Redis Client Error', err))
                .on('success', () => console.log('success connect'));

            client.connect();

            await client.sendCommand(['ZREMRANGEBYSCORE', email,'0',JSON.stringify(pastResult)]
            ).then(
                res => {
                    console.log(res)
                }
            ).catch(
                err =>{
                    console.log(err)
                }
            )

            await client.sendCommand(['ZRANGE',email,'0','-1']).then(
                res => {
                    console.log(res)
                    return response.status(HttpCode.E200).send(new Err(HttpCode.E200,ErrStr.OK,res))
                }
            ).catch(
                err =>{
                    console.log(err)
                    return response.status(HttpCode.E400).send(new Err(HttpCode.E400 ,ErrStr.ErrStore,err))
                }
            )

        }


        if(mode === OrderMode.ONE_YEAR || mode === OrderMode.ALL){
            console.log(mode)
            try{
                let date = new Date()

               if( mode === OrderMode.ONE_YEAR)
               { date.setFullYear(date.getFullYear()-1)}
                else{
                    date.setFullYear(date.getFullYear()-100)
               }

                orders = await OrderController.repo.find({
                    where: {
                        updateAt: MoreThan(date),
                        userEmail: email,
                        orderStatus: OrderStatusCode.COMPLETED,

                    }
                })

            }catch (e){
                console.log('error,write to db',e)
                return response.status(HttpCode.E400).send(new Err(HttpCode.E400 ,ErrStr.ErrStore,e))
            }

        }


        return response.status(HttpCode.E200).send(new Err(HttpCode.E200,ErrStr.OK,orders))

    }

    static async one(request: Request, response: Response, next: NextFunction) {
        const {orderId} = request.params

        if(!orderId){
            return response.status(HttpCode.E400).send(new Err(HttpCode.E400 ,ErrStr.ErrMissingParameter))
        }
        let order = null;

        try{
            order = await OrderController.repo.findOneOrFail(orderId)

        }catch (e){
            console.log('error,write to db',e)
            return response.status(HttpCode.E400).send(new Err(HttpCode.E400 ,ErrStr.ErrStore,e))
        }

        return response.status(HttpCode.E200).send(new Err(HttpCode.E200,ErrStr.OK,order))

    }

    static async create(request: Request, response: Response, next: NextFunction) {

        let {price,invoice,taxRate,total,orderItems,isStaff,isActive,isDelete,userEmail,payment,orderStatus,orderType} = request.body

        let order = new Order()
        order.price = price
        order.taxRate = taxRate
        order.total = total
        order.orderItems = orderItems
        order.isStaff = isStaff
        order.isActive = isActive
        order.isDelete = isDelete
        order.userEmail = userEmail
        order.invoice = invoice

        try{
            const errors = await validate(order)
            if(errors.length > 0){

                return response.status(HttpCode.E400).send(new Err(HttpCode.E400,'orderError',errors))
            }

            let res = await OrderController.validateOrder(orderStatus,orderType,payment)
            console.log(res)
            order.orderStatus = res[0].entities[0]
            order.orderType = res[1].entities[0]
            order.payment = res[2].entities[0]

            await OrderController.repo.save(order)
        } catch (e){
            console.log('error,write to db',e)
            return response.status(HttpCode.E400).send(new Err(HttpCode.E400 ,ErrStr.ErrStore,e))

        }

        return response.status(HttpCode.E200).send(new Err(HttpCode.E200,ErrStr.OK,order))



    }

    static async delete(request: Request, response: Response, next: NextFunction) {

    }

    static async update(request: Request, response: Response, next: NextFunction) {


        const {orderId} = request.params
        if(!orderId){
            return response.status(HttpCode.E400).send(new Err(HttpCode.E400 ,ErrStr.ErrMissingParameter))
        }

        let order = null

        try{
            order = await OrderController.repo.findOneOrFail(orderId)

        }catch (e){
            console.log('error,write to db',e)
            return response.status(HttpCode.E400).send(new Err(HttpCode.E400 ,ErrStr.ErrStore,e))
        }

        let {price,invoice,taxRate,total,orderItems,isStaff,isActive,isDelete,userEmail,payment,orderStatus,orderType} = request.body


        order.price = price
        order.taxRate = taxRate
        order.total = total
        order.orderItems = orderItems
        order.isStaff = isStaff
        order.isActive = isActive
        order.isDelete = isDelete
        order.userEmail = userEmail
        order.invoice = invoice

        try{
            const errors = await validate(order)

            if(errors.length > 0){

                return response.status(HttpCode.E400).send(new Err(HttpCode.E400,'orderError',errors))
            }

            let res = await OrderController.validateOrder(orderStatus,orderType,payment)
            console.log(res)
            order.orderStatus = res[0].entities[0]
            order.orderType = res[1].entities[0]
            order.payment = res[2].entities[0]
            await OrderController.repo.save(order)

            if(order.orderStatus.id === OrderStatusCode.COMPLETED){
                OrderController.redisSaving(order,userEmail)
            }


        } catch (e){
            console.log('error,write to db',e)
            return response.status(HttpCode.E400).send(new Err(HttpCode.E400 ,ErrStr.ErrStore,e))

        }

        return response.status(HttpCode.E200).send(new Err(HttpCode.E200,ErrStr.OK,order))

    }


    static async redisSaving(order,userEmail) {
        const client = require('redis').createClient();

        client.on('error', (err) => console.log('Redis Client Error', err))
            .on('success', () => console.log('success connect'));

        client.connect();

        await client.sendCommand(['ZADD', userEmail, JSON.stringify(new Date().getTime()), JSON.stringify(order)]
        ).then(
            res => {
                console.log(res)
            }
        ).catch( error=>{
            console.log(error)
        })


    }



    static async validateOrder(orderStatus: number, orderType: number, payment:number) {

        if (typeof orderStatus !== 'number' || orderStatus <= 0 ||
            typeof orderType !== 'number' || orderType <= 0 ||
            typeof payment !== 'number' || payment <= 0) {
            throw (new Err(HttpCode.E400, ErrStr.ErrWrongId))

        }


        let res: IdCheckRes[] = []


        try {

            let temp = await OrderController.checkIdExist([orderStatus], OrderStatusController.repo)
            console.log('temp-orderStatus',temp)
            if (temp.index !== -1) {

                throw (new Err(HttpCode.E400, ErrStr.ErrWrongId + temp.index))
            }

            res.push(temp)



            temp = await OrderController.checkIdExist([orderType], OrderTypeController.repo)
            console.log('temp-orderType',temp)
            if (temp.index !== -1) {

                throw (new Err(HttpCode.E400, ErrStr.ErrWrongId + temp.index))
            }

            res.push(temp)



            temp = await OrderController.checkIdExist([payment], PaymentController.repo)
            console.log('temp-payment',temp)
            if (temp.index !== -1) {

                throw (new Err(HttpCode.E400, ErrStr.ErrWrongId + temp.index))
            }

            res.push(temp)

        } catch (e) {
            console.log('error, write to db', e)
            throw( new Err(HttpCode.E400),'invalidate orderStatus id or orderType ids',e )
        }

        console.log(res)
        return res
    }



}

