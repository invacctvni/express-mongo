import {MongoClient} from "mongodb"
let dbConnection 

    export const connectToDb = (cb) => {
        MongoClient.connect('mongodb+srv://admin:641125@cluster0.t9hr7.mongodb.net/bookstore')
            .then((client) => {
                dbConnection = client.db()
                return cb()
            })
            .catch(err => {
                console.log(err)
                return cb(err)
            })
    }
    export const getDb = () => dbConnection //return a value which is a db connection. allow communicate to db. 
    
