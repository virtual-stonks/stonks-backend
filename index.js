const express = require('express');
const bodyParser =  require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const userRouter = require("./routes/user");
const stockRouter = require("./routes/stock");

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());


app.use("/api/user", userRouter);
app.use("/api/stock", stockRouter);

app.use('/', (req, res) => {
    res.send('stonks-backend is running!');
})

const CONNECTION_URL = process.env.MONGO_URI;
const PORT = process.env.PORT|| 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);