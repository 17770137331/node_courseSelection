const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
const { Curriculum } = require('../../model/admin/curriculum')
const { Admin } = require('../../model/admin/index')
const curriculumSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Admin
    },
    study: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Curriculum
    }

})

const UserAndStudy = mongoose.model('UserAndStudy', curriculumSchema)

module.exports = {
    UserAndStudy
}