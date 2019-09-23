'use strict'

exports.ok = (value, res) => {
    const data = {
        status: 200,
        value: values,
    }
    res.json(data)
    res.end()
}

exports.pagination = (totalData, page, totalPage, limit, values, res, search, category) => {
    const data = {
        status: 200,
        data: values,
        totalData: totalData,
        page: page,
        totalPage: totalPage,
        limit: limit,
        search: search,
        selectedCategory: category
    }
    res.json(data)
    res.end()
}