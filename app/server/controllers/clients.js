var auth = require('./auth');
var logger = require('winston');
var rest = require('restler');
var util = require('../modules/util');
var config = require('../../../config');
var _ = require('underscore');

var ClientsController = {};

ClientsController.clientsModel = {};

ClientsController.fetchClients = function (callback) {
    auth.getAccessToken(function (err, authToken) {
        if (err) {
            callback(err);
        }
        else {
            var options = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authToken
                },
                query: {
                    limit: 0 // get all records with no limit
                }
            };

            var url = config.resourceguru.baseUriWithDomain + '/clients';

            logger.debug('getClients url: ' + url);

            rest.get(url, options)
                .on('success', function (result, response) {
                    logger.debug('getClients: ' + result.length + ' records');
                    ClientsController.clientsModel = result;
                    ClientsController.clientsModel.lastUpdate = new Date();
                    callback(null, result);
                })
                .on('fail', function (result, response) {
                    util.handleWebRequestError(result, response, callback);
                })
                .on('error', function (result, response) {
                    util.handleWebRequestError(result, response, callback);
                });
        }
    });
}

ClientsController.getClients = function (callback) {
    if (ClientsController.clientsModel.lastUpdate && !util.isDataStale(ClientsController.clientsModel.lastUpdate)) {
        logger.info('getClients data is fresh, so return from cache');
        callback(null, ClientsController.clientsModel);
    }
    else {
        logger.info('getClients data is stale, so get from web service');
        ClientsController.fetchClients(callback);
    }
}

module.exports = ClientsController;

logger.debug('ClientsController loaded');