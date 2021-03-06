var express = require('express');
const { check } = require('express-validator');


var router = express.Router();
var user_controller = require('../controllers/userController');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

router.use('/api/users/docs', swaggerUi.serve);
router.get('/api/users/docs', swaggerUi.setup(swaggerDocument));
router.get('/api/users/health-status',user_controller.gethealthStatus);
router.post('/api/users/summary',user_controller.getSummary);
router.post('/api/users/search',user_controller.searchUsers); //search user by various filter
router.get('/api/users/:uid',user_controller.getUserById); //done

router.post('/api/users/create',user_controller.createUser); //done
router.patch('/api/users/:uid/apartment/add',user_controller.addApartmentToUser);//done
router.patch('/api/users/:uid/apartment/remove',user_controller.removeApartmentFromUser);//done

//router.patch('/api/users/:uid/event/add',user_controller.addEventToUser);//done
//router.patch('/api/users/:uid/event/remove',user_controller.removeEventFromUser);//done

router.put('/api/users/:uid',user_controller.editUser); // done
router.delete('/api/users/:uid',user_controller.deleteUser); //not done
module.exports = router;