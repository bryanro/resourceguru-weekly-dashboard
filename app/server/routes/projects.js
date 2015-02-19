var express = require('express');
var router = express.Router();
var util = require('../modules/util')
var ProjectsController = require('../controllers/projects');

router.get('/', function (req, res, next) {

    ProjectsController.getProjects(function (err, projects) {
        if (err) {
            res.status(500).send({ errorMessage: err });
        }
        else {
            res.status(200).send(projects);
        }
    });
});

module.exports = router;