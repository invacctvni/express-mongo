import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import routes from "./routes/index";

var cors = require('cors')

// import routes from "./routes";

const SERVER_POST = 3100

//这个从typeorm来的，这个会解析ormconfig.json的数据项，然后会打开数据库或者链接数据库
createConnection().then(async connection => {


    const app = express();
    //这个bodyParser是说，所有http发来的请求，body部门都会被解析成json的格式，而json可以直接设置成object，方便我们处理，
    app.use(bodyParser.json());
    app.use(cors())
    app.use('/',routes)
    app.listen(SERVER_POST);

    console.log(`Express server has started on port ${SERVER_POST}. Open http://localhost:${SERVER_POST}/users to see results`);

}).catch(error => console.log(error));
