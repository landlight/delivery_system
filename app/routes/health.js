var healthController = require('../controllers/health');

var express = require('express');
var router = express.Router();

router.route('/health')
      .get(healthController.health);

module.exports = router;