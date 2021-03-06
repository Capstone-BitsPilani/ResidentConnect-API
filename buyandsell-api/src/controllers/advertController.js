

const { validationResult } = require('express-validator');


const HttpError = require('../models/http-error');
const mongoose = require('mongoose');

const Advert = require('../models/advert');

const Category=require('../models/category-info')
const SubCategory=require('../models/subcategory-info');

exports.gethealthStatus= async function(req, res,next) {
  const returnval="Advert service running...";
    res.status(200).send( returnval);
}


exports.getAdById= async function(req, res,next) {
    const adid=req.params.aid;
    let advert;
    try{
        advert=await Advert.findById(adid)
    }
    catch (err) {
        const error = new HttpError(
          `Something went wrong, could not find a advertisement- ${adid}`,
          500
        );
        return next(error);
      }

      
  if (!advert) {
    const error = new HttpError(
      'Could not find a advertisement for the provided id.',
      404
    );
    return next(error);
  }  
  res.json(advert.toObject({ getters: true }) );
}
exports.deleteAdById= async function(req, res,next) {
  const advertid=req.params.aid;  
  let advert;

  try {
    advert=await Advert.findById(advertid).populate();
    advert.remove();
     } catch (err) {
         console.log(err);
         const error = new HttpError(
           'Something went wrong, could not delete model.',
           500
         );
         return next(error);
       }
       if (!advert) {
         const error = new HttpError('Could not find advert for this id.', 404);
         return next(error);
       } 
    
    
     res.status(200).json({ message: 'Deleted advert.' });

}
/*exports.getAdsByCommunityId= async function(req, res,next) {
    const communityid=req.params.cid;


    let adverts,count;
    try {
        adverts = await Advert.find({'communityid':communityid});
        count = await Advert.find({'communityid':communityid}).countDocuments();
    } catch (err) {
      const error = new HttpError(
        `Fetching advertisements failed for community ${communityid},  please try again later.`,
        500
      );
      return next(error);
    }
  

    res.json({count: count, adverts: adverts.map(ad => ad.toObject({ getters: true }))});
}*/

exports.getAds= async function(req, res,next) {
  let ads,count;
   console.log(req.body);
   let query={};
   if(req.body.hasOwnProperty('title'))
    {
      for(var field in req.body)
      {
        if(field==='title')
         query[field]=new RegExp(req.body[field], 'i')
        else
            query[field]=req.body[field];
      }
    }
    else
     query=req.body;


  try {
      ads = await Advert.find(query);
      count = await Advert.find(req.body).countDocuments();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      `Fetching adverts failed,  please try again later.`,
      500
    );
    return next(error);
  }
 


  res.json({count: count, ads: ads.map(ad => ad.toObject())});
}

exports.createAd= async function(req, res,next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
          new HttpError('Invalid inputs passed, please check your data.', 422)
        );
      }

   const advert=new Advert(req.body);
   advert.save();
   res.status(201).json(advert);
}

//router.get('/api/adverts/categories',classifieds_controller.getCategories);

exports.getCategories = async function(req, res,next) {
  
  let categories,count;
  try {
    categories = await Category.find();
    console.log(categories);
      count = await Category.find().countDocuments();
  } catch (err) {
    const error = new HttpError(
      'Fetching categoies failed, please try again later.',
      500
    );
    return next(error);
  }


  res.json({count: count, categories: categories.map(category => category.toObject())});

}
//router.post('/api/adverts/categories',classifieds_controller.getSubCategories);
exports.getSubCategories = async function(req, res,next) {
  let subcategories,count;
  let category=req.body.category;
  try {
    subcategories = await SubCategory.find({'category':category});
      count = await SubCategory.find({'category':category}).countDocuments();
  } catch (err) {
    const error = new HttpError(
      'Fetching categoies failed, please try again later.',
      500
    );
    return next(error);
  }


  res.json({count: count, subcategories: subcategories.map(subcategory => subcategory.toObject())});

}
//router.post('/api/adverts/categories/create',classifieds_controller.createCategory);
exports.createCategory = async function(req, res,next) {
  
  console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
          new HttpError('Invalid inputs passed, please check your data.', 422)
        );
      }

   const categoryObj=new Category(req.body);
   categoryObj.save();
   res.status(201).json({ categoryObj });

}
//router.post('/api/adverts/subcategories/create',classifieds_controller.createSubCategory);
exports.createSubCategory = async function(req, res,next) {

  console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
          new HttpError('Invalid inputs passed, please check your data.', 422)
        );
      }

   const subcategoryObj=new SubCategory(req.body);
   subcategoryObj.save();
   res.status(201).json({ subcategoryObj });

}