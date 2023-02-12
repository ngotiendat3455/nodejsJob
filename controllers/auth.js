const { BadRequestError, UnauthenticatedError } = require('../errors')
const User = require('../models/User')
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const login = async(req, res) => {
    // res.send('register user');

    const {  email, password} = req.body;
    if(!email || !password){
        throw new BadRequestError('bad request something')
    }
    const user =await User.findOne({
        email
    });
    console.log('user', user);
    if(!user){
        throw new UnauthenticatedError('Invalid Credenticals')
    }
    const isMatch = user.comparePassword(password);
    if(!isMatch){
        throw new UnauthenticatedError('Invalid Credenticals')
    }
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user, token})
}

const register = async(req, res) => {
    const { name, email, password} = req.body;
    console.log('req', req)
    const user = await User.create({name, email, password})
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({user, token})
    // res.send('register user');
}


module.exports = {
    login,
    register
}