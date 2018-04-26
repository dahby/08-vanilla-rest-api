'use strict';

const logger = require('../lib/logger');
const Food = require('../model/food');
const storage = require('../lib/storage');

module.exports = function routeFood(router) {
  router.post('/api/v1/food', (req, res) => {
    logger.log(logger.INFO, 'FOOD-ROUTE: POST /api/v1/foo');

    try {
      const newFood = Food(req.body.title, req.body.content);
      storage.create('food', newFood)
        .then((food) => {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify(food));
          res.end();
          return undefined;
        }); 
    } catch (err) {
      logger.log(logger.ERROR, `FOOD-ROUTE: There was a bad request ${err}`);
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.write('Bad request');
      res.end();
      return undefined;
    }
    return undefined;
  });

  router.get('/api/v1/food', (req, res) => {
    if (!req.url.query.id) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('Your request requires an id');
      res.end();
      return undefined;
    }
    storage.fetchOne('food', req.url.query.id)
      .then((item) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(item));
        res.end();
        return undefined;
      })
      .catch((err) => {
        logger.log(logger.ERROR, err, JSON.stringify(err));
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('Resource not found');
        res.end();
        return undefined;
      });
    return undefined;
  });
};
