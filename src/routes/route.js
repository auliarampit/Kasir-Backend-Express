const express = require('express')
const Route = express.Router()
const multer = require('multer')

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${new Date().getTime()}${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

const controllers = require('../controllers/menu')

Route
    //GET
    .get('/menu', controllers.getMenu)

    //POST
    .post('/menu', upload.single('image'), controllers.addMenu)

module.exports = Route