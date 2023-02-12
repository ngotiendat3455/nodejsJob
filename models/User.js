const moogoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UserSchema = new moogoose.Schema({
    name: {
        type: String,
        max: 50,
        min: 3,
        required: [true, 'Please provide name']
    },
    email: {
        type: String,
        max: 50,
        min: 3,
        required: [true, 'Please provide email'],
        unique: true,
        match: [ /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide valid email']
    },
    password: {
        type: String,
        max: 12,
        min: 3,
        required: [true, 'Please provide password']
    }
})

UserSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

UserSchema.methods.createJWT = function (){
    return jwt.sign(
        { userId: this._id, name: this.name, },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_LIFETIME
        })
}

UserSchema.methods.comparePassword = async function (notHasedPassword){
    const isMatch = await bcrypt.compare(notHasedPassword, this.password);
    return isMatch;
}
module.exports = moogoose.model('User', UserSchema);