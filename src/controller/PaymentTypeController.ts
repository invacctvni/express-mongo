import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Order} from "../entity/Order";
import {PaymentType} from "../entity/PaymentType";
import {Err, ErrStr, HttpCode} from "../helper/Err";

export class PaymentTypeController {
    public static get repo(){
        return getRepository(PaymentType)
    }

    static async all(request: Request, response: Response, next: NextFunction) {
        let paymentType = []

        try{
            paymentType = await PaymentTypeController.repo.find()

        }catch (e){
            console.log('error,get the db',e)
            return response.status(400).send(new Err(HttpCode.E400 ,ErrStr.ErrStore,e))
        }



        return response.status(200).send(new Err(HttpCode.E200,ErrStr.OK,paymentType))
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