import {Router} from "express";

import order from './order'
import payment from "./payment";
import orderStatus from "./orderStatus";
import paymentStatus from "./paymentStatus";
import paymentType from "./paymentType";
import orderType from "./orderType";

const routes = Router()
routes.get('/',(req,res)=>{
    return res.send('all orders here')
})

routes.use('/order',order)
routes.use('/payment',payment)

routes.use('/orderStatus',orderStatus)
routes.use('/paymentStatus',paymentStatus)

routes.use('/orderType',orderType)
routes.use('/paymentType',paymentType)
export default routes