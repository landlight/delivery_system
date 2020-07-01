var express = require('express');
var appRouter = express.Router();

let healthRoutes = require('./health');
let deliveryRoute = require('./deliveryRoute');

appRouter.use(healthRoutes);
appRouter.use('/deliveryRoute', deliveryRoute);

module.exports = appRouter;