import {Router} from "express";
import {PaymentStatusController} from "../controller/PaymentStatusController";

const router = Router()

router.get('/',PaymentStatusController.all)
router.get('/:orderStatusId',PaymentStatusController.one)
router.post('/',PaymentStatusController.create)
router.put('/:orderStatusId',PaymentStatusController.update)
router.delete('/:orderStatusId',PaymentStatusController.delete)

export default router