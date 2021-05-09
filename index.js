const express = require('express');
const bodyParser =  require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const schedule = require('node-schedule')

const userRouter = require("./routes/user");
const stockRouter = require("./routes/stock");
const externalRouter = require("./routes/external");

const {globalCronUpdateLtp} = require('./cron/globalCronUpdateLtp.js');

const app = express();
dotenv.config();

app.use(express.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());
app.use(morgan('tiny'));


app.use("/api/user", userRouter);
app.use("/api/stock", stockRouter);
app.use("/api/external", externalRouter);

app.use('/', (req, res) => {
    res.send('stonks-backend is running!');
})

const CONNECTION_URL = process.env.MONGO_URI;
const PORT = process.env.PORT|| 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => app.listen(PORT, () => {
  	console.log(`Server Running on Port: ${PORT}`)   
  }))
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);	
mongoose.set('debug', true);


// CRON
const cronTime = 120;
schedule.scheduleJob(`*/${cronTime} * * * * *`, globalCronUpdateLtp);               