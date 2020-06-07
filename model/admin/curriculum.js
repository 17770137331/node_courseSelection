const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
const curriculumSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    // 课程号
    courseNumber: {
        type: String,
    },
    // 学分
    credit: {
        type: String,
        required: true
    },
    // 老师
    teacher: {
        type: String,
        required: true
    },
    // 课时
    classhuor: {
        type: String,
        required: true
    },
    // 描述
    describe: {
        type: String,
    },
    // 图片
    prcture: {
        type: String,
    },
    // 类型
    value: {
        type: String
    }
})

const Curriculum = mongoose.model('curriculum', curriculumSchema)
    // Curriculum.create({
    //     name: '云计算/大数据5',
    //     courseNumber: '45',
    //     credit: '3',
    //     teacher: '王老师',
    //     classhuor: '20课时',
    //     describe: `大厂offer统统斩获，竞赛奖杯拿到手软！修炼编程基本功，跻身万千程序员中最顶尖的1% ！`,
    //     prcture: 'http://edu-image.nosdn.127.net/262CD94D80797907F281CBF860B9876B.jpg?imageView&thumbnail=426y240&quality=100',
    //     value: '技术支撑'
    // }).then(() => {
    //     console.log('用户创建成功')
    // }).catch((e) => {
    //     console.log('用户创建失败', e)
    // })

module.exports = {
    Curriculum
}