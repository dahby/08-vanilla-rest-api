'use strict';

const logger = require('./logger');
const url = require('url');
const queryString = require('querystring');

module.exports = function urlParser(req) {
  req.url = url.parse(req.url);
  req.url.query = queryString.parse(req.url.query);
  logger.log(logger.INFO, `URL-PARSER: Parsed url as ${JSON.stringify(req.url.query)}`);
  return Promise.resolve(req);
};
