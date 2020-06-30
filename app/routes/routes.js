var express = require('express');
var appRouter = express.Router();

let healthRoutes = require('./health');

appRouter.use(healthRoutes);

module.exports = appRouter;