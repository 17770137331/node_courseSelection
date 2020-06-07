const express = require('express')
const svgCaptcha = require('svg-captcha')
const { Admin } = require('../../model/admin/index')
const { Curriculum } = require('../../model/admin/curriculum')
const { UserAndStudy } = require('../../model/admin/userAndStudy')
let myYzm = ''

const admin = express.Router()

admin.get('/admin', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.send(req.session)
})

admin.post('/admin', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.send(req.session)
})

// 验证码
admin.get('/yzm', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    const { data, text } = svgCaptcha.create({
        size: 5,
        noise: 3,
        ignoreChars: '0o1il',
        color: true,
        background: 'white',
        height: 40
    })
    req.session.yzm = text.toLowerCase();
    myYzm = req.session.yzm
        // console.log(req.session)
    res.type('svg')
    res.write(data)
    res.end()
})

// 管理员登录
admin.post('/adminLogin', async(req, res) => {
    const { user, paw, yzm } = req.body
    if (user.trim().length == 0) {
        res.json({
            meta: {
                status: 400,
                msg: '用户名为空'
            }
        })
        return
    }
    if (paw.trim().length == 0) {
        res.json({
            meta: {
                status: 400,
                msg: '密码为空'
            }
        })
        return
    }
    if (yzm.trim().length == 0) {
        res.json({
            meta: {
                status: 400,
                msg: '验证码为空'
            }
        })
        return
    }
    var vv = req.session
        // console.log(yzm.trim().toLowerCase(), myYzm, yzm.trim().toLowerCase() != myYzm)
        // if (yzm.trim().toLowerCase() != myYzm) {
        //     // console.log(yzm.trim(), req.session)
        //     res.json({
        //         meta: {
        //             status: 400,
        //             msg: '验证码错误'
        //         },
        //         vv
        //     })
        //     return
        // }
    const admin = await Admin.findOne({ user })
    if (admin) {
        if (admin.paw == paw) {
            res.json({
                meta: {
                    status: 200,
                    msg: '登录成功'
                }
            })
            return
        } else {
            res.send({
                meta: {
                    status: 400,
                    msg: '用户名或密码错误'
                }
            })
            return
        }
    } else {
        res.send({
            meta: {
                status: 400,
                msg: '用户名或密码错误'
            }
        })
        return
    }
})

// 用户信息 
admin.post('/userList', async(req, res) => {
    const { skip, limit } = req.body
    let li = 6
    let sk = 0
    if (skip) sk = skip
    if (limit) li = limit
    const number = await (await Admin.find()).length
    const admin = await Admin.find().skip(+li * (sk > 0 ? sk - 1 : sk)).limit(+li)
    res.json({
        data: admin,
        total: number
    })
})

// 查询用户信息
admin.post('/searchAdmin', async(req, res) => {
    const { skip, limit, user } = req.body
    let li = 6
    let sk = 0
    if (skip) sk = skip
    if (limit) li = limit
    const number = await (await Admin.find({ user })).length
    const admin = await Admin.find({ user }).skip(+li * (sk > 0 ? sk - 1 : sk)).limit(+li)
    res.json({
        data: admin,
        total: number
    })
})

// 添加用户
admin.post('/addUser', async(req, res) => {
    const { user, paw, email } = req.body
    try {
        const list = await Admin.create({
            user,
            paw,
            email,
            role: '普通用户',
            state: 0
        })
    } catch (error) {
        res.json({
            state: 400,
            msg: '添加失败！'
        })
    }
    
    if(list) {
        res.json({
            state: 200,
            msg: '添加成功！'
        })
    }else{
        res.json({
            state: 400,
            msg: '添加失败！'
        })
    }
    console.log(list)
})

// 修改用户信息
admin.post('/updataUser', async(req, res) => {
    const { new1, old1 } = req.body
    const aa = await Admin.findOne({user: old1.user})
    // console.log(aa, new1, old1)
    try {
        const list = await Admin.updateOne({_id: aa._id, email: aa.email} , {email: new1.email})
    } catch (error) {
        res.json({
            state: 400,
            msg: '修改失败邮箱重复了！'
        })
    }
    res.json({
        state: 200,
        msg: '修改成功！'
    })
}) 

// 删除用户
admin.post('/deleteUser', async(req, res) => {
    const { user } = req.body
    const list = await Admin.findOneAndRemove({user})
    if(list) {
        res.json({
            state: 200,
            msg: '删除成功！'
        })
    } else {
        res.json({
            state: 400,
            msg: '删除失败！'
        })
    }
})

// 课程信息
admin.post('/curriculum', async(req, res) => {
    // console.log(req.body)
    const { skip, limit } = req.body
    let li = 6
    let sk = 0
    if (skip) sk = skip
    if (limit) li = limit
    const number = await (await Curriculum.find()).length
    const list = await Curriculum.find().skip(+li * (sk > 0 ? sk - 1 : sk)).limit(+li)
    res.json({
        data: list,
        total: number
    })
})

// 查询课程信息
admin.post('/searchCurriculum', async(req, res) => {
    const { skip, limit, user } = req.body
    let li = 6
    let sk = 0
    if (skip) sk = skip
    if (limit) li = limit
    const number = await (await Curriculum.find({ name: user })).length
    const admin = await Curriculum.find({ name: user }).skip(+li * (sk > 0 ? sk - 1 : sk)).limit(+li)
    res.json({
        data: admin,
        total: number
    })
})

// 添加课程
admin.post('/addCurriculum', async(req, res) => {
    const { name, credit, teacher, keshi, describe, prcture, value} = req.body
    try {
        const list =await Curriculum.create({
            name,
            courseNumber: name,
            credit,
            teacher,
            classhuor: keshi,
            describe,
            prcture,
            value
        })
    } catch (error) {
        res.json({
            state: 400,
            msg: '课程名称重复了！'
        })
    }
    
    res.json({
        state: 200,
        msg: '添加成功！'
    })
    
})

// 修改用户信息
admin.post('/updataCurriculum', async(req, res) => {
    const { new1, old1 } = req.body
    const aa = await Curriculum.findOne({name: old1.name})
    try {
        const list = await Curriculum.updateOne({_id: aa._id}, {$set:{name: new1.name, credit: new1.credit, teacher: new1.teacher, classhuor: new1.keshi, describe: new1.describe, prcture: new1.prcture, value: new1.value}})
    } catch (error) {
        res.json({
            state: 400,
            msg: '课程名称重复了！'
        })
    }
    
    res.json({
        state: 200,
        msg: '修改成功！'
    })
    console.log(list)
}) 

// 删除课程
admin.post('/deleteCurriculum', async(req, res) => {
    const { name } = req.body
    const list = await Curriculum.findOneAndRemove({name})
    if(list) {
        res.json({
            state: 200,
            msg: '删除成功！'
        })
    } else {
        res.json({
            state: 400,
            msg: '删除失败！'
        })
    }
})


// 查询用户选课信息
admin.get('/UserAndCurriculum', async(req, res) => {
    const { skip, limit } = req.query
    let li = 6
    let sk = 0
    if (skip) sk = skip
    if (limit) li = limit
    let ad = await Admin.find().skip(+li * (sk > 0 ? sk - 1 : sk)).limit(+li)
    let ke = await UserAndStudy.find().populate('study')
    let admin = JSON.parse(JSON.stringify(ad))
    const number = await (await Admin.find()).length
    for (let index = 0; index < admin.length; index++) {
        admin[index].data = []
        for (let index2 = 0; index2 < ke.length; index2++) {
            if(admin[index]._id == ke[index2].user) {
                admin[index].data.push(ke[index2])
            }
        }
    }
    // console.log(admin)
    res.json({
        data: admin,
        total: number
    })
})

// 查询用户信息2
admin.post('/searchAdmin2', async(req, res) => {
    const { skip, limit, user } = req.body
    let li = 6
    let sk = 0
    if (skip) sk = skip
    if (limit) li = limit

    const number = await (await Admin.find({ user })).length

    const ad = await Admin.find({ user }).skip(+li * (sk > 0 ? sk - 1 : sk)).limit(+li)

    let ke = await UserAndStudy.find().populate('study')

    let admin = JSON.parse(JSON.stringify(ad))

    for (let index = 0; index < admin.length; index++) {
        admin[index].data = []
        for (let index2 = 0; index2 < ke.length; index2++) {
            if(admin[index]._id == ke[index2].user) {
                admin[index].data.push(ke[index2])
            }
        }
    }
    res.json({
        data: admin,
        total: number
    })
})
module.exports = admin