var express = require('express');
var router = express.Router();
var util = require('../modules/util');
var moment = require('moment');
var logger = require('winston');
var BookingsController = require('../controllers/bookings');
var ClientsController = require('../controllers/clients');
var ProjectsController = require('../controllers/projects');
var ResourcesController = require('../controllers/resources');

router.get('/', function (req, res, next) {

    var monthAgo = moment().subtract(1, 'month');

    if (BookingsController.bookingsModel) {
        BookingsController.bookingsModel.lastUpdate = monthAgo;
    }
    if (BookingsController.bookingsModelWeekly) {
        BookingsController.bookingsModelWeekly.lastUpdate = monthAgo;
    }

    if (ClientsController.clientsModel) {
        ClientsController.clientsModel.lastUpdate = monthAgo;
    }

    if (ProjectsController.projectsModel) {
        ProjectsController.projectsModel.lastUpdate = monthAgo;
    }

    if (ResourcesController.resourcesModel) {
        ResourcesController.resourcesModel.lastUpdate = monthAgo;
    }

    logger.info('refreshed all models, so next get will pull from server');

    res.status(204).send();
});

module.exports = router;