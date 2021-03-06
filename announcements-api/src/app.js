
const express = require('express');
const bodyParser = require('body-parser');
const cors=require('cors');

const announcementRouter = require('./routes/announcementRouter');




const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(announcementRouter);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
  });
  app.use((error, req, res, next) => {
    if (res.headerSent) {
      return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
  });  

  module.exports = app;