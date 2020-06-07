const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
const userSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 12,
        unique: true
    },
    paw: {
        type: String,
        required: true
    },
    email: {
        type: String,
        // 唯一
        unique: true,
        required: true
    },
    // admin 超级管理员
    // normal 普通管理员
    role: {
        type: String,
        required: true
    },
    // 0 启用状态
    // 1 禁止
    state: {
        type: Number,
        default: 0
    }
})

const Admin = mongoose.model('user', userSchema)
    // Admin.create({
    //     user: '123456789',
    //     paw: 'admin',
    //     email: '122421275248@qq.com',
    //     role: '普通用户',
    //     state: 0
    // }).then(() => {
    //     console.log('用户创建成功')
    // }).catch(() => {
    //     console.log('用户创建失败')
    // })
module.exports = {
    Admin
}