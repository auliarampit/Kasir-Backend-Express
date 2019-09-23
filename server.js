const express =require('express')
const app = express()
const port = process.env.PORT || 2020
const bodyParser = require('body-parser')
const cors = require('cors')

const route = require('./src/routes/route')


app.listen(port, () => {
    console.log(`kita sekarang menggunakan port :` + port)
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// var whitelist = ['http://192.168.6.101']
// var corsOption = {
//     origin: (origin, callback) => {
//         if (whitelist.indexOf(origin) !== -1 || !origin) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'))
//         }
//     }
// }

// app.use(cors(corsOption))
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods' , '*')
    res.setHeader('Access-Control-Allow-Headers' , '*')
    next();
  });

app.use('/', route)