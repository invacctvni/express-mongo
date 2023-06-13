import express from 'express' 
import { connectToDb, getDb} from "./db.js"
import router from './router/index.js';
//init app & middleware 
const app = express() 
import {ObjectId} from 'mongodb';
const PORTNUMBER  = 3000 
//db connection 
let db 
connectToDb((err) => {
    if (!err) {
        app.listen(PORTNUMBER, () => {
            console.log(`app listening on port ${PORTNUMBER}`)
        })
        db = getDb()  
    }
})

//routes route handler 
// app.get('/books', (req, res) => {
//     let books = []
//     db.collection('books')
//     .find() //cursor toArray forEach which an object of point to send docs
//     // .sort({color: 1}) //cursor method sort by alpabet
//     .forEach(book => books.push(book)) 
//     .then(() => {
//         // console.log("book", book)
//         res.status(200).json(books)
//     })
//     .catch(() => {
//         res.status(500).json({error: "Could not fetch the document"})
//     })
//     // res.json({msg: 'welcome to MongoDB API' })
// })
app.use('/', router)

app.get('/books/:id', (req, res) => {
    let id = req.params.id
    console.log(id)
    db.collection('books')
    // ObjectId("4ecc05e55dd98a436ddcc47c")
    .findOne({"_id" : new ObjectId(id)})
    .then((r) => {
        // console.log()
        res.status(200).json(r)
    })
    .catch((e) => {
        console.log(e)
        res.status(500).json({error: "Could not fetch the document"})
    })
})


