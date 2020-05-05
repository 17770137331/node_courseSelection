const express = require('express')

const admin = express.Router()

admin.get('/admin', (req, res) => {
    res.send('欢迎来到admin')
})

module.exports = admin