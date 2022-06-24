import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Order} from "../entity/Order";
import {PaymentStatus} from "../entity/PaymentStatus";
import {Err, ErrStr, HttpCode} from "../helper/Err";
import {Payment} from "../entity/Payment";

export class PaymentStatusController {
    public static get repo(){
        return getRepository(PaymentStatus)
    }

    static async all(request: Request, response: Response, next: NextFunction) {
        let paymentStatus = []

        try{
            paymentStatus = await PaymentStatusController.repo.find()

        }catch (e){
            console.log('error,get the db',e)
            return response.status(400).send(new Err(HttpCode.E400 ,ErrStr.ErrStore,e))
        }



        return response.status(200).send(new Err(HttpCode.E200,ErrStr.OK,paymentStatus))
    }

    static async one(request: Request, response: Response, next: NextFunction) {

    }

    static async create(request: Request, response: Response, next: NextFunction) {
        return response.send('create all orders')
    }

    static async delete(request: Request, response: Response, next: NextFunction) {

    }

    static async update(request: Request, response: Response, next: NextFunction) {

    }

}