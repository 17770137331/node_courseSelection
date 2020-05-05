const express = require('express')

const serve = express()

serve.listen(3000, () => {
    console.log('http://127.0.0.1:3000')
})