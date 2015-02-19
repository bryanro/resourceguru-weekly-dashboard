var express = require('express');
var router = express.Router();
var util = require('../modules/util')
var ResourcesController = require('../controllers/resources');

router.get('/', function (req, res, next) {

    ResourcesController.getResources(function (err, projects) {
        if (err) {
            res.status(500).send({ errorMessage: err });
        }
        else {
            res.status(200).send(projects);
        }
    });
});

module.exports = router;