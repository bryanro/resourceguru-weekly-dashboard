var auth = require('./auth');
var logger = require('winston');
var rest = require('restler');
var util = require('../modules/util');
var config = require('../../../config');
var _ = require('underscore');
var async = require('async');

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
                },
                query: {
                    limit: 0 // get all records with no limit
                }
            };

            async.series({
                getProjects: function (asyncCallback) {
                    var url = config.resourceguru.baseUriWithDomain + '/projects';

                    logger.debug('getProjects url: ' + url);

                    rest.get(url, options)
                        .on('success', function (result, response) {
                            logger.debug('getProjects: ' + result.length + ' records');
                            ProjectsController.projectsModel = result;
                            ProjectsController.projectsModel.lastUpdate = new Date();
                            asyncCallback(null, result);
                        })
                        .on('fail', function (result, response) {
                            util.handleWebRequestError(result, response, asyncCallback);
                        })
                        .on('error', function (result, response) {
                            util.handleWebRequestError(result, response, asyncCallback);
                        });
                },
                getProjectsArchived: function (asyncCallback) {
                    var url = config.resourceguru.baseUriWithDomain + '/projects/archived';

                    logger.debug('getProjectsArchived url: ' + url);

                    rest.get(url, options)
                        .on('success', function (result, response) {
                            logger.debug('getProjectsArchived: ' + result.length + ' records');
                            ProjectsController.projectsModel = _.union(ProjectsController.projectsModel, result);
                            asyncCallback(null, result);
                        })
                        .on('fail', function (result, response) {
                            util.handleWebRequestError(result, response, asyncCallback);
                        })
                        .on('error', function (result, response) {
                            util.handleWebRequestError(result, response, asyncCallback);
                        });
                }
            }, function (asyncError, results) {
                if (asyncError) {
                    callback(asyncError);
                }
                else {
                    callback(null, ProjectsController.projectsModel);
                }
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