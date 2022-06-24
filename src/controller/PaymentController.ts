import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";

import {Payment} from "../entity/Payment";
import {Err, ErrStr, HttpCode} from "../helper/Err";
import {IdCheckRes, MkController} from "./MKController";
import {validate} from "class-validator";
import {PaymentStatusController} from "./PaymentStatusController";
import {PaymentTypeController} from "./PaymentTypeController";
import {OrderStatusCode, PaymentStatusCode} from "../helper/OrderHelp";
import paymentStatus from "../routes/paymentStatus";


export class PaymentController extends MkController{
    public static get repo(){
        return getRepository(Payment)
    }

    //
    static async validateOrder(paymentStatus: number, paymentType: number) {

        if (typeof paymentStatus !== 'number' || paymentStatus <= 0 || typeof paymentType !== 'number' || paymentType <= 0) {
            throw (new Err(HttpCode.E400, ErrStr.ErrWrongId))

        }


        let res: IdCheckRes[] = []

        //查user和product是存在的
        try {
            //第一步是测试user
            let temp = await PaymentController.checkIdExist([paymentStatus], PaymentStatusController.repo)
            console.log('temp-paymentStatus',temp)
            if (temp.index !== -1) {

                throw (new Err(HttpCode.E400, ErrStr.ErrWrongId + temp.index))
            }

            res.push(temp)

             temp = await PaymentController.checkIdExist([paymentType], PaymentTypeController.repo)
            console.log('temp-paymentType',temp)
            if (temp.index !== -1) {

                throw (new Err(HttpCode.E400, ErrStr.ErrWrongId + temp.index))
            }

            res.push(temp)


        } catch (e) {
            console.log('error, write to db', e)
            throw( new Err(HttpCode.E400),'invalidate paymentStatus id or paymentType ids',e )
        }
        return res
    }


    static async all(request: Request, response: Response, next: NextFunction) {

        let payments = []

        try{
            payments = await PaymentController.repo.find()

        }catch (e){
            console.log('error,write to db',e)
            return response.status(400).send(new Err(HttpCode.E400 ,ErrStr.ErrStore,e))
        }

        return response.status(200).send(new Err(HttpCode.E200,ErrStr.OK,payments))
    }


    static async one(request: Request, response: Response, next: NextFunction) {

        const {paymentId} = request.params
        let client = PaymentController.connectRedis()

        if(!paymentId){
            return response.status(400).send(new Err(HttpCode.E400 ,ErrStr.ErrMissingParameter))
        }
        let payment:Payment= null;

        try{
            let paymentStr = await client.get(`payment-${paymentId}`);
            if(paymentStr !== null){
                return response.status(200).send(new Err(HttpCode.E200,ErrStr.OK,JSON.parse(paymentStr)))
            }else{
                payment = await PaymentController.repo.findOneOrFail({
                    where:{id:paymentId},relations: ['paymentStatus', 'paymentType']
                })

            }


        }catch (e){
            console.log('error,write to db',e)
            return response.status(400).send(new Err(HttpCode.E400 ,ErrStr.ErrStore,e))
        }



        return response.status(200).send(new Err(HttpCode.E200,ErrStr.OK,payment))




    }

    static async create(request: Request, response: Response, next: NextFunction) {
        let {email,name,shippingAddress,billingAddress,paymentStatus,paymentType} = request.body

        let payment = new Payment()
        payment.email = email
        payment.name = name
        payment.shippingAddress = shippingAddress
        payment.billingAddress = billingAddress



        try{
            const errors = await validate(payment)

            if(errors.length > 0){
                console.log('here')
                return response.status(HttpCode.E400).send(new Err(HttpCode.E400,'paymentError',errors))
            }

            let res = await PaymentController.validateOrder(paymentStatus,paymentType)
            console.log(res)
            payment.paymentStatus = res[0].entities[0]
            payment.paymentType = res[1].entities[0]

            await PaymentController.repo.save(payment)

        } catch (e){
            console.log('error,write to db',e)
            return response.status(400).send(new Err(HttpCode.E400 ,ErrStr.ErrStore,e))

        }

        return response.status(HttpCode.E200).send(new Err(HttpCode.E200,ErrStr.OK,payment))

    }

    static async delete(request: Request, response: Response, next: NextFunction) {

    }

    static async update(request: Request, response: Response, next: NextFunction) {
        //第一步，先查询
        const {paymentId} = request.params
        if(!paymentId){
            return response.status(400).send(new Err(HttpCode.E400 ,ErrStr.ErrMissingParameter))
        }
        //第二步，判断商品是不是存在
        let payment = null

        try{
            payment = await PaymentController.repo.findOneOrFail(paymentId)

        }catch (e){
            console.log('error,write to db',e)
            return response.status(400).send(new Err(HttpCode.E400 ,ErrStr.ErrStore,e))
        }

        //第三步，类似于create验证

        let {email,name,shippingAddress,billingAddress,paymentStatus,paymentType} = request.body

        payment.email = email
        payment.name = name
        payment.shippingAddress = shippingAddress
        payment.billingAddress = billingAddress



        try{
            const errors = await validate(payment)

            if(errors.length > 0){
                console.log('here')
                return response.status(HttpCode.E400).send(new Err(HttpCode.E400,'paymentError',errors))
            }

            let res = await PaymentController.validateOrder(paymentStatus,paymentType)
            console.log(res)
            payment.paymentStatus = res[0].entities[0]
            payment.paymentType = res[1].entities[0]

            await PaymentController.repo.save(payment)

            if(payment.paymentStatus.id === PaymentStatusCode.COMPLETED){
                PaymentController.redisSaving(paymentId,payment)

            }
        } catch (e){
            console.log('error,write to db',e)
            return response.status(400).send(new Err(HttpCode.E400 ,ErrStr.ErrStore,e))

        }

        return response.status(HttpCode.E200).send(new Err(HttpCode.E200,ErrStr.OK,payment))

    }

    static async redisSaving(paymentId,payment) {
        const client = require('redis').createClient();

        client.on('error', (err) => console.log('Redis Client Error', err))
            .on('success', () => console.log('success connect'));

        client.connect();

        let halfYear = JSON.stringify(365 / 2 * 24 * 3600 * 1000)

        await client.sendCommand(['SETEX',`payment-${paymentId}`,halfYear,JSON.stringify(payment)]).then(
           res=> console.log(res)
        ).catch(
            err => console.log(err)
        )

    }







    static connectRedis():any{
        const client = require('redis').createClient();

        client.on('error', (err) => console.log('Redis Client Error', err))
            .on('success', () => console.log('success connect'));

        client.connect();
        return client
    }


}
