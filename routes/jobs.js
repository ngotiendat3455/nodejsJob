const express = require('express')
const { createJob, deleteJob, getJob, getJobs, updateJob } = require('../controllers/jobs')
const router = express.Router();

router.route('/').post(createJob).get(getJobs);
router.route('/:id').get(getJob).delete(deleteJob).patch(updateJob);


module.exports = router;