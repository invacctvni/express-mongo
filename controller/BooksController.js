import { connectToDb, getDb} from "../db.js"
class BookController {
    // static _queryRunner: QueryRunner = null
    constructor() {}
    static async getBooks(req, res) {
        let db 
// connectToDb((err) => {
//     if (!err) {
//         app.listen(PORTNUMBER, () => {
//             console.log(`app listening on port ${PORTNUMBER}`)
//         })
//         db = getDb()  
//     }
// })
        let books = []
        getDb().collection('books')
        .find() //cursor toArray forEach which an object of point to send docs
        // .sort({color: 1}) //cursor method sort by alpabet
        .forEach(book => books.push(book)) 
        .then(() => {
            // console.log("book", book)
            res.status(200).json(books)
        })
        .catch(() => {
            res.status(500).json({error: "Could not fetch the document"})
        })
        // res.json({msg: 'welcome to MongoDB API' })
    }
}

export default BookController