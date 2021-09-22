var express = require('express');
const { models } = require('mongoose');
var router = express.Router();
var apartments_Controller = require('../controllers/apartmentsController');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));
router.get('/api/community/apartments/getschema',apartments_Controller.getSwaggerSchema);

router.get('/api/community/apartments/validatetoken/:token',apartments_Controller.valitateToken);

router.get('/api/community/:communityid/apartments',apartments_Controller.apartments_list);
router.post('/api/community/apartments',apartments_Controller.apartments_search);

router.get('/api/community/:communityid/apartment/:apartmentid',apartments_Controller.apartment_details);
router.post('/api/community/apartment/create',apartments_Controller.apartment_create_post);
router.put('/api/community/apartment/:apartmentid',apartments_Controller.apartment_update);
//router.patch('/api/apartment/:apartmentid/user/add',apartments_Controller.addUserToApartment);
//router.patch('/api/apartment/:apartmentid/user/remove',apartments_Controller.removeUserFromApartment);
router.post('/api/community/apartments/summary',apartments_Controller.getSummary);
module.exports = router;