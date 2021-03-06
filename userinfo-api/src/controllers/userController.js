

const { validationResult } = require('express-validator');
const axios = require ('axios');
const HttpError = require('../models/http-error');
const mongoose = require('mongoose');

const User = require('../models/user');

exports.gethealthStatus=async function(req, res,next) {
  const returnval="userInfo service running ...";
  res.status(200).send( returnval);
}

exports.getSummary= async function(req, res,next) {
  let summary,count;
   

 User.aggregate([
      {$match:{"communities": new mongoose.Types.ObjectId(req.body.communities)}}, 
      {
          $group:
          {
              _id: { type: "$type" },
              total: { $sum: 1 },
          }
      }
  ])
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        console.log(err);
        const error = new HttpError(
          `Something went wrong,`,
          500
        );
        return next(error);
      })

}
exports.getUserById = async function(req, res,next) {
    const userid=req.params.uid;
    let user;
    try{
        user=await User.findById(userid)
    }
    catch (err) {
        const error = new HttpError(
          `Something went wrong, could not find a user- ${userid}`,
          500
        );
        return next(error);
      }

      
  if (!user) {
    const error = new HttpError(
      'Could not find a user for the provided id.',
      404
    );
    return next(error);
  }  
  res.json(user.toObject() );

}

exports.searchUsers= async function(req, res,next) {
  
    let users,count;
   
    try {
        users = await User.find(req.body);
        count = await User.find(req.body).countDocuments();
    } catch (err) {
      const error = new HttpError(
        `Fetching users failed,  please try again later.`,
        500
      );
      return next(error);
    }
   
 

    res.json({count: count, users: users.map(user => user.toObject())});
}
exports.createUser = async function(req, res,next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
          new HttpError('Invalid inputs passed, please check your data.', 422)
        );
      }

   const user=new User(req.body);
   user.save();
   res.status(201).json({ user });
}
exports.addApartmentToUser= async function(req, res,next) {
    const userid=req.params.uid;
    const data=req.body;

    let user;
 /************* Fetch User by id*************************** */
    try{
        user=await User.findById(userid)
    }
    catch (err) {
        const error = new HttpError(
          `Something went wrong, could not find a user- ${userid}`,
          500
        );
        return next(error);
      }

      
  if (!user) {
    const error = new HttpError(
      'Could not find a user for the provided id.',
      404
    );
    return next(error);
  } 
  
  
 
  try {
  
    const sess = await mongoose.startSession();
    sess.startTransaction();  
    user.apartments.push(data);
    await user.save({ session: sess });    
    await sess.commitTransaction();
  
    
   
  } catch (err) {
      console.log(err);
    const error = new HttpError(
      'adding apartment to user failed, please try again.',
      500
    );
    return next(error);
  }

 
  
  res.json(user.toObject() );

}

exports.removeApartmentFromUser= async function(req, res,next) {
    const userid=req.params.uid;
    const aptid=req.body.apartmentid;
    let user;
 /************* Fetch User by id*************************** */
    try{
        user=await User.findById(userid)
    }
    catch (err) {
        const error = new HttpError(
          `Something went wrong, could not find a user- ${userid}`,
          500
        );
        return next(error);
      }

      
  if (!user) {
    const error = new HttpError(
      'Could not find a user for the provided id.',
      404
    );
    return next(error);
  } 
  
  
 
  try {
   
    const sess = await mongoose.startSession();
    sess.startTransaction();  
    user.apartments.pull(aptid);
    await user.save({ session: sess });    
    await sess.commitTransaction();
  
    
   
  } catch (err) {
      console.log(err);
    const error = new HttpError(
      'adding apartment to user failed, please try again.',
      500
    );
    return next(error);
  }

 
  
  const body={userid:user._id};
  axios.patch(`http://rc-apartments-srv:4000/api/apartment/${aptid}/user/remove`, body)
 .then(res => {}
 )
 .catch(err=>{
     //console.log(err);
     const error = new HttpError(
         'Something went wrong. User is not added in apartment object',
         500
       );
       return next(error);
 })

  
  res.json(user.toObject() );

}

exports.editUser = async function(req, res,next) {
  
  const userid=req.params.uid;


    const filter={_id:userid};
    const update=req.body;
    let user;
    try{
      user=await User.findOneAndUpdate(filter, update, {
        new: true
      });
      
    }
  catch (err) {
    console.log(err);
      const error = new HttpError(
        `Something went wrong, could not edit a user- ${userid}`,
        500
      );
      return next(error);
    }

    
if (!user) {
  const error = new HttpError(
    'Could not find a community for the provided id.',
    404
  );
  return next(error);
}  

res.status(200).json(user.toObject() );

}
exports.deleteUser = async function(req, res,next) {
    const userid = req.params.uid;

  let user;
  try {
    user = await User.findById(userid);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete user.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for this id.', 404);
    return next(error);
  }

  try {
    await user.remove();

  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete user.',
      500
    );
    return next(error);
}   
}


exports.addEventToUser= async function(req, res,next) {

    const userid=req.params.uid;
    const eventid=req.body.eventid;
    let user;
 /************* Fetch User by id*************************** */
    try{
        user=await User.findById(userid)
    }
    catch (err) {
        const error = new HttpError(
          `Something went wrong, could not find a user- ${userid}`,
          500
        );
        return next(error);
      }

      
  if (!user) {
    const error = new HttpError(
      'Could not find a user for the provided id.',
      404
    );
    return next(error);
  } 
  
  
 
  try {
  
    const sess = await mongoose.startSession();
    sess.startTransaction();  
    user.events.push(eventid);
    await user.save({ session: sess });    
    await sess.commitTransaction();
  
    
   
  } catch (err) {
      console.log(err);
    const error = new HttpError(
      'adding event to user failed, please try again.',
      500
    );
    return next(error);
  }

  res.json(user.toObject() );
}

exports.removeEventFromUser= async function(req, res,next) {
    const userid=req.params.uid;
    const eventid=req.body.eventid;
    let user;
 /************* Fetch User by id*************************** */
    try{
        user=await User.findById(userid)
    }
    catch (err) {
        const error = new HttpError(
          `Something went wrong, could not find a user- ${userid}`,
          500
        );
        return next(error);
      }

      
  if (!user) {
    const error = new HttpError(
      'Could not find a user for the provided id.',
      404
    );
    return next(error);
  } 
  
  
 
  try {
  
    const sess = await mongoose.startSession();
    sess.startTransaction();  
    user.events.pull(eventid);
    await user.save({ session: sess });    
    await sess.commitTransaction();
  
    
   
  } catch (err) {
      console.log(err);
    const error = new HttpError(
      'removing event from user failed, please try again.',
      500
    );
    return next(error);
  }

  res.json(user.toObject() );
}
