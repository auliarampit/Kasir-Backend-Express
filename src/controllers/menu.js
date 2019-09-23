'use strict'

const response = require('../helpers/response')
const conn = require('../config/db')
const cloudinary = require('cloudinary')

exports.getMenu = (req, res) => {
    let params = {
        page: parseInt(req.query.page) || 1,
        search: req.query.search || '',
        sort: req.query.sort || 'ASC',
        limit: parseInt(req.query.limit) || 10,
        category: req.query.category || '',
    }
    let conState = params.category == '' ? 'OR' : 'AND'
    let totalData
    let totalPage
    let offset = (params.page -1) * params.limit

    conn.query(
        `SELECT count(*) 'total' FROM menu INNER JOIN category ON category.id = menu.category WHERE menu.name LIKE
        '%${params.search}%' ${conState} category.name = '${params.category}'`,
        (error, rows, field) => {
            totalData = rows[0].total
            totalPage = Math.ceil(Number(totalData) / params.limit)
        }
    )
    conn.query(
        `SELECT menu.name, image, category.name 'category', price, category.id as 'idCategory', menu.id as 'idMenu' FROM 
        menu INNER JOIN category ON category.id = menu.category WHERE menu.name LIKE '%${params.search}%' ${conState}
        category.name = '${params.category}' ORDER BY price ${params.sort} limit ${params.limit} offset ${offset}`,
        (error, rows, field) => {
            if (error) {
                throw error
            } else {
                if (rows.legnth == 0) {
                    response.pagination(totalData, params.page, totalPage, params.limit, rows, res, params.search, params.category)
                } else {
                    response.pagination(totalData, params.page, totalPage, params.limit, rows, res, params.search, params.category)
                }
            }
        }
    )
}

exports.addMenu = async(req, res) => {
        let path = req.file.path
        let getUrl = async () => {
            cloudinary.config({
                cloud_name: 'dc7eeeawc',
                api_key: '897613438572716',
                api_secret: '1fwReJ0lm6UxJxRgpQP1EJ5unpE'
            })
            let data
            await cloudinary.uploader.upload(path, (result, error) => {
                const fs = require('fs')
                fs.unlinkSync(path)
                data = result
            })
            return data
        }
        let result
        await getUrl().then((res) => {
            result = res
        }).catch((err) => {
            throw err
        })

    const data = {
        name : req.body.name,
        price : req.body.price,
        category : req.body.category,
        image : result.url,
    }
    
    conn.query(
        `INSERT INTO menu SET ?`, data,
        (error, rows, field) => {
            if (error) {
                throw error
            } else {
                conn.query(
                    `SELECT menu.name, image, category.name 'category', price, category.id as 'idCategory', menu.id as 'idMenu' FROM
                    menu INNER JOIN category ON category.id = menu.category ORDER BY price DESC limit 1`,
                    (error, rows, field) => {
                        if (error) {
                            console.log(error)
                        } else {
                            return res.send({
                                data: rows
                            })
                        }
                    }
                )
            }
        }
    )
}