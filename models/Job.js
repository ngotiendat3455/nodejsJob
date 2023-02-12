const moogoose = require('mongoose')
const bcrypt = require('bcryptjs')

const JobSchema = new moogoose.Schema({
    company: {
        type: String,
        max: 50,
        min: 3,
        required: [true, 'Please company name']
    },
    position: {
        type: String,
        max: 100,
        min: 3,
        required: [true, 'Please provide position'],
     },
    status: {
        type: String,
        // required: [true, 'Please provide status'],
        enum: ['pending', 'declined', 'interview'],
        default: 'pending'
    },
    createdBy: {
        type: moogoose.Types.ObjectId,
        ref: 'User'
    }
},{ 
    timestamps: true
})

module.exports = moogoose.model('Job', JobSchema)