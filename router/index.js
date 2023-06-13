import { Router } from "express";
import BookController from "../controller/BooksController.js"
const router = Router();

router.get('/books', BookController.getBooks)



export default router