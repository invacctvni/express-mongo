import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {OrderStatus} from "../entity/OrderStatus";
import {Err, ErrStr, HttpCode} from "../helper/Err";

export class OrderStatusController {
    public static get repo(){
        return getRepository(OrderStatus)
    }

    static async all(request: Request, response: Response, next: NextFunction) {
        let orderStatus = []

        try{
            orderStatus = await OrderStatusController.repo.find()

        }catch (e){
            console.log('error,get the db',e)
            return response.status(400).send(new Err(HttpCode.E400 ,ErrStr.ErrStore,e))
        }


        return response.status(200).send(new Err(HttpCode.E200,ErrStr.OK,orderStatus))
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
