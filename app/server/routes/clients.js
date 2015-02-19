var express = require('express');
var router = express.Router();
var util = require('../modules/util')
var ClientsController = require('../controllers/clients');

router.get('/', function (req, res, next) {

    ClientsController.getClients(function (err, clients) {
        if (err) {
            res.status(500).send({ errorMessage: err });
        }
        else {
            res.status(200).send(clients);
        }
    });
});

module.exports = router;