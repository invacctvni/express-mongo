import {Router} from "express";
import {PaymentTypeController} from "../controller/PaymentTypeController";

const router = Router()

router.get('/',PaymentTypeController.all)
router.get('/:orderTypeId',PaymentTypeController.one)
router.post('/',PaymentTypeController.create)
router.put('/:orderTypeId',PaymentTypeController.update)
router.delete('/:orderTypeId',PaymentTypeController.delete)

export default router