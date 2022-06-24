import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Order} from "../entity/Order";
import {OrderType} from "../entity/OrderType";
import {Err, ErrStr, HttpCode} from "../helper/Err";
import orderType from "../routes/orderType";

export class OrderTypeController {
    public static get repo(){
        return getRepository(OrderType)
    }

    static async all(request: Request, response: Response, next: NextFunction) {
        let orderType = []

        try{
            orderType = await OrderTypeController.repo.find()

        }catch (e){
            console.log('error,get the db',e)
            return response.status(400).send(new Err(HttpCode.E400 ,ErrStr.ErrStore,e))
        }



        return response.status(200).send(new Err(HttpCode.E200,ErrStr.OK,orderType))
    }

    static async one(request: Request, response: Response, next: NextFunction) {

        const {orderTypeId} = request.params
        if(!orderTypeId){
            return response.status(400).send(new Err(HttpCode.E400 ,ErrStr.ErrMissingParameter))
        }
        let orderType = null;

        try{
            orderType = await OrderTypeController.repo.findOneOrFail(orderTypeId)

        }catch (e){
            console.log('error,write to db',e)
            return response.status(400).send(new Err(HttpCode.E400 ,ErrStr.ErrStore,e))
        }


        return response.status(200).send(new Err(HttpCode.E200,ErrStr.OK,orderType))

    }

    static async create(request: Request, response: Response, next: NextFunction) {
        return response.send('create all orders')
    }

    static async delete(request: Request, response: Response, next: NextFunction) {

    }

    static async update(request: Request, response: Response, next: NextFunction) {

    }

}