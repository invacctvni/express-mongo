import {Request, Response} from "express"
import {getMongoManager} from "typeorm"
import Book from "../entity/BookEntity"
class BookController {
    // static _queryRunner: QueryRunner = null
    constructor() {
        return {}
    }

    static async createBook(req:Request, res:Response) {
        const bookData = req.body 
        const book = new Book()
        book.name = "ABC"
        book.color = "red"

        // const manager = getMongoManager()
        // await manager.save(book)
    }

//     static async getBooks(req: Request, res: Response) {
//         // const db
// // connectToDb((err) => {
// //     if (!err) {
// //         app.listen(PORTNUMBER, () => {
// //             console.log(`app listening on port ${PORTNUMBER}`)
// //         })
// //         db = getDb()
// //     }
// // })
//         const books = []
//         getDb().collection('books')
//         .find() // cursor toArray forEach which an object of point to send docs
//         // .sort({color: 1}) //cursor method sort by alpabet
//         .forEach(book => books.push(book))
//         .then(() => {
//             // console.log("book", book)
//             return res.status(200).json(books)
//             // res.status(200).json(books)
//         })
//         .catch(() => {
//             return res.status(500).json({error: "Could not fetch the document"})
//         })
//         // res.json({msg: 'welcome to MongoDB API' })
//     }
}

export default BookController