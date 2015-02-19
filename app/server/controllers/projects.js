var auth = require('./auth');
var logger = require('winston');
var rest = require('restler');
var util = require('../modules/util');
var config = require('../../../config');
var _ = require('underscore');

var ProjectsController = {};

ProjectsController.projectsModel = {};

ProjectsController.fetchProjects = function (callback) {

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

            var url = config.resourceguru.baseUriWithDomain + '/projects';

            logger.debug('getProjects url: ' + url);

            rest.get(url, options)
                .on('success', function (result, response) {
                    logger.debug('getProjects: ' + result.length + ' records');
                    ProjectsController.projectsModel = result;
                    ProjectsController.projectsModel.lastUpdate = new Date();
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

ProjectsController.getProjects = function (callback) {
    if (ProjectsController.projectsModel.lastUpdate && !util.isDataStale(ProjectsController.projectsModel.lastUpdate)) {
        logger.info('getProjects data is fresh, so return from cache');
        callback(null, ProjectsController.projectsModel);
    }
    else {
        logger.info('getProjects data is stale, so get from web service');
        ProjectsController.fetchProjects(callback);
    }
}

module.exports = ProjectsController;

logger.debug('ProjectsController loaded');