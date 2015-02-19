var auth = require('./auth');
var logger = require('winston');
var rest = require('restler');
var util = require('../modules/util');
var config = require('../../../config');
var _ = require('underscore');

var ResourcesController = {};

ResourcesController.resourcesModel = {};

ResourcesController.fetchResources = function (callback) {

    auth.getAccessToken(function (err, authToken) {
        if (err) {
            callback(err);
        }
        else {
            var options = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authToken
                }
            };

            var url = config.resourceguru.baseUriWithDomain + '/resources';

            logger.debug('getResources url: ' + url);

            rest.get(url, options)
                .on('success', function (result, response) {
                    logger.debug('getResources: ' + result.length + ' records');
                    ResourcesController.resourcesModel = result;
                    ResourcesController.resourcesModel.lastUpdate = new Date();
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

ResourcesController.getResources = function (callback) {
    if (ResourcesController.resourcesModel.lastUpdate && !util.isDataStale(ResourcesController.resourcesModel.lastUpdate)) {
        logger.info('getResources data is fresh, so return from cache');
        callback(null, ResourcesController.resourcesModel);
    }
    else {
        logger.info('getResources data is stale, so get from web service');
        ResourcesController.fetchResources(callback);
    }
}

module.exports = ResourcesController;

logger.debug('ResourcesController loaded');