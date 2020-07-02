var deliveryRouteController = require('../controllers/deliveryRoute');

var express = require('express');
var router = express.Router();

router.route('/findCostByRoute')
      .get(deliveryRouteController.findCostByRoute);

router.route('/:id')
      .get(deliveryRouteController.getRouteById);

router.route('/:id')
      .put(deliveryRouteController.editRoute);

router.route('/:id') 
      .delete(deliveryRouteController.deleteRoute);

router.route('/')
      .post(deliveryRouteController.create);

router.route('/')
      .get(deliveryRouteController.getAllRoutes);

module.exports = router;