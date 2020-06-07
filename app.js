const express = require('express')
const home = require('./route/home')
const admin = require('./route/admin')
require('./model/connect')
const body = require('body-parser')
const redis = require('redis')
const session = require("express-session")
const cookieParser = require('cookie-parser')
let RedisStore = require('connect-redis')(session)
const cors = require('cors');
// require('./model/admin/index')

const serve = express()
    // --args --disable-web-security --user-data-dir
    //设置跨域访问

//设置允许跨域访问该服务.
// serve.all('*', function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
//     // res.header('Access-Control-Allow-Headers', 'Content-Type');
//     res.header('Access-Control-Allow-Methods', '*');
//     res.header('Content-Type', 'application/json;charset=utf-8');
//     next();
// });

let client = redis.createClient()

// var corsOptions = {
//     origin: 'http://localhost:8080',
//     credentials: true,
//     maxAge: '1728000'
//         //这一项是为了跨域专门设置的
// }
// serve.use(cors(corsOptions))

serve.use(body.urlencoded({ extended: false }))
serve.use(body.json())
serve.use(cookieParser())
serve.use(session({
    secret: 'bjlemon',
    key: 'blog',
    resave: false,
    saveUninitialized: true,
    rolling: true,
    store: new RedisStore({ client }),
    cookie: { maxAge: 1000 * 60 * 60 }
}))
serve.use(home)
serve.use(admin)

serve.listen(3000, () => {
    console.log('http://127.0.0.1:3000')
})