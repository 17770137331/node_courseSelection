const express = require('express')
const home = require('./route/home')
const admin = require('./route/admin')

const serve = express()
serve.use(home)
serve.use(admin)

serve.listen(3000, () => {
    console.log('http://127.0.0.1:3000')
})