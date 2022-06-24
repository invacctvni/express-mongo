import {Router} from "express";
import {OrderController} from "../controller/OrderController";
// import {ProductController} from "../controller/ProductController";

const router = Router()

router.get('/',OrderController.all)
router.get('/:orderId',OrderController.one)
router.post('/',OrderController.create)
router.put('/:orderId',OrderController.update)
router.delete('/:orderId',OrderController.delete)

export default router