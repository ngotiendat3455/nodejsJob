const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');
const JobModal = require('../models/Job')

const getJobs = async(req, res) => {
    // res.send('get jobs user')
    const createdBy = req.user.userId;
    const jobs = await JobModal.find({
        createdBy
    }).sort({ createdAt: 1 });
    res.status(StatusCodes.OK).json(jobs)
}

const getJob = async(req, res) => {
    // res.send('get jobs user')
    console.log('req.params', req.params);
    const createdBy = req.user.userId
    const jobId = req.params.id;
    const jobDetail = await JobModal.findOne({
        createdBy,
        _id:jobId
    });
    if(!jobDetail){
        throw new BadRequestError(`Not found with jobId ${jobDetail}`)
    }
    res.status(StatusCodes.OK).json(jobDetail)
}

const createJob = async(req, res) => {
    // res.send('create jobs user')
    const createdBy = req.user.userId
    const obj = {
        ...req.body,
        createdBy
    };
    const jobDetail = await JobModal.create(obj);
    res.status(StatusCodes.CREATED).json(jobDetail)
}

const updateJob = async(req, res) => {
    const createdBy = req.user.userId
    const jobId = req.params.id;
    const { company, position, status } = req.body;
    if(!company || !position){
        throw new BadRequestError('Company and Position is required')
    }
    const jobDetail = await JobModal.findByIdAndUpdate(jobId, req.body, {
        new: true,
        runValidators: true
    });
    if(!jobDetail){
        throw new BadRequestError(`No job found with id: ${jobId}`)
    }
    res.status(StatusCodes.OK).json(jobDetail)
}
const deleteJob = async(req, res) => {
    const createdBy = req.user.userId
    const jobId = req.params.id
    const jobDetail = await JobModal.findByIdAndRemove({
        _id: jobId,
        createdBy
    })
    if(!jobDetail){
        throw new BadRequestError(`No job found with id: ${jobId}`)
    }
    res.status(StatusCodes.OK).json(jobDetail)
}

module.exports = {
    getJob,
    getJobs,
    createJob,
    updateJob,
    deleteJob
}