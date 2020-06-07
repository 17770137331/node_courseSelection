const express = require('express')
const { Curriculum } = require('../../model/admin/curriculum')
const { Admin } = require('../../model/admin/index')
const { UserAndStudy } = require('../../model/admin/userAndStudy')

const home = express.Router()

home.get('/', (req, res) => {
    res.send('欢迎来到home')
})


home.get('/value', async(req, res) => {
    const { value, skip, limit } = req.query
    let li = 6
    let sk = 0
    if (skip) sk = skip
    if (limit) li = limit
    const number = await Curriculum.find({ value })
    const admin = await Curriculum.find({ value }).skip(+li * (sk > 0 ? sk - 1 : sk)).limit(+li)
    res.json({
        data: admin,
        size: number.length,
        skip: sk,
        limit: li
    })
})

home.post('/resgiter', async(req, res) => {
    const { user, paw, email } = req.body
        // console.log(req.body)
    const list = await Admin.create({
        user,
        paw,
        email,
        role: '普通用户',
        state: 0
    }).then(() => {
        console.log('用户创建成功')
        res.json({
            state: 200,
            msg: '用户注册成功'
        })
    }).catch(() => {
        res.json({
            state: 400,
            msg: '用户注册失败'
        })
    })
})

home.post('/login', async(req, res) => {
    const { user, paw } = req.body
    console.log(req.body)
    const list = await Admin.findOne({ user })
        // console.log(list, list.paw, paw == list.paw)
    if (!list) res.json({
        state: 400,
        msg: '用户名或密码错误'
    })
    else {
        if (paw == list.paw) {
            res.json({
                state: 200,
                msg: '登录成功'
            })
        }
    }
})

home.post('/addStudy', async(req, res) => {
    const { study, user } = req.body
    const shu = await Curriculum.findOne({ name: study })
    const ren = await Admin.findOne({ user })
    const isNO = await UserAndStudy.findOne({ user: ren._id, study: shu._id })
    if (isNO) {
        res.json({
            state: 400,
            msg: '添加失败'
        })
    } else {
        const list = await UserAndStudy.create({
            user: ren._id,
            study: shu._id
        })
        res.json({
            state: 200,
            msg: '添加成功'
        })
    }
    // console.log(shu, ren, isNO)
})

home.get('/query', async(req, res) => {
    const { user, skip, limit } = req.query
    let li = 6
    let sk = 0
    if (skip) sk = skip
    if (limit) li = limit
    const list = await Admin.findOne({ user })
    const id = list._id
    const study = await UserAndStudy.find({ user: id })
    const number = await UserAndStudy.find({ user: id })
    const ke = await UserAndStudy.find({ user: id }).populate('study').skip(+li * (sk > 0 ? sk - 1 : sk)).limit(+li)
    res.json({
        data: ke,
        size: number.length,
        skip: sk,
        limit: li
    })
})

home.get('/delete', async(req, res) => {
    const { user, study } = req.query
    const us = await Admin.findOne({ user })
    const userId = us._id
    const st = await Curriculum.findOne({ name: study })
    const studyId = st._id
    const isNO = await UserAndStudy.findOneAndDelete({ user: userId, study: studyId })
    if (isNO) {
        res.json({
            state: 200,
            msg: '删除成功'
        })
    } else {
        res.json({
            state: 400,
            msg: '删除失败'
        })
    }
})
module.exports = home