require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const limiter = rateLimiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
})

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
// api
const jobApi = require('./routes/jobs')
const authApi = require('./routes/auth')
// authentication
const authentication = require('./middleware/authentication');
// extra packages
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(limiter)
app.use(express.json());
// connectDB
const connectDB = require('./db/connect')
// routes

app.set('trust proxy', 1);
app.get('/hello', (req, res) => {
  res.send('jobs api');
});
app.use('/api/v1/auth',authApi)
app.use('/api/v1/jobs', authentication, jobApi)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONG_URL)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
