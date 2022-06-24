import {Router} from "express";
import {OrderTypeController} from "../controller/OrderTypeController";


const router = Router()

router.get('/',OrderTypeController.all)
router.get('/:orderTypeId',OrderTypeController.one)
router.post('/',OrderTypeController.create)
router.put('/:orderTypeId',OrderTypeController.update)
router.delete('/:orderTypeId',OrderTypeController.delete)

export default router