
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors=require('cors')
const communityRouter = require('./routes/community');
//const apartmentmodelsRouter = require('./src/routes/apartmentmodels');
const apartmentsRouter=require('./routes/apartments');
const apartmentmodeRouter=require('./routes/apartment-model');
const HttpError = require('./models/http-error');



const app = express();

app.use(cors());
app.use(bodyParser.json());
//app.set('trust proxy',true);

//app.use(apartmentmodelsRouter);
app.use(apartmentsRouter);
app.use(communityRouter);
app.use(apartmentmodeRouter);
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

 
mongoose
  .connect( process.env.MONGO_URI)
  //.connect('mongodb+srv://admin:admin@residentsconnect-cluste.r0t44.mongodb.net/apartmentsinfo?retryWrites=true&w=majority')
  .then(() => {
    app.listen(4000,()=>{
        console.log('****************************************Apartment Info Service: Listening on 4000');
    });
  })
  .catch(err => {
    console.log(err);
  });