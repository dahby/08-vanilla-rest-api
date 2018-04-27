'use strict';

const logger = require('../lib/logger');
const Food = require('../model/food');
const storage = require('../lib/storage');

module.exports = function routeFood(router) {
  router.post('/api/v1/food', (req, res) => {
    logger.log(logger.INFO, 'FOOD-ROUTE: POST /api/v1/food');

    try {
      const newFood = new Food(req.body.title, req.body.content);
      storage.create('Food', newFood)
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
    logger.log(logger.INFO, 'FOOD-ROUTE: GET /api/v1/food');
    if (!req.url.query.id) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.write('Your request requires an id');
      res.end();
      return undefined;
    }
    storage.fetchOne('Food', req.url.query.id)
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

  router.get('/api/v1/food/all', (req, res) => {
    logger.log(logger.INFO, 'FOOD-ROUTE: GET food array');
    storage.fetchAll('Food')
      .then((item) => {
        const foodArray = [];
        Object.keys(item).forEach(key => foodArray.push(item[key].id));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(item));
        res.end();
        return undefined;
      })
      .catch((err) => {
        logger.log(logger.ERROR, err, JSON.stringify(err));
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('foodArray not found');
        res.end();
        return undefined;
      });
    return undefined;
  });

  router.put('/api/v1/food', (req, res) => {
    logger.logg(logger.INFO, 'FOOD-ROUTE: UPDATE food');
    if (!req.body.id) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.write('Update request requires ID');
      res.end();
      return undefined;
    }
    try {
      storage.update('Food', req.url.query.id)
        .then((food) => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify(food));
          res.end();
          return undefined;
        });
    } catch (err) {
      logger.log(logger.ERROR, `FOOD-ROUTE: Bad request ${err}`);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('PUT Resource not found');
      res.end();
      return undefined;
    }
    return undefined;
  });

  router.delete('/api/v1/food', (req, res) => {
    logger.log(logger.INFO, 'FOOD-ROUTE: DEL /api/v1/food');
    if (!req.url.query.id) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.write('Delete request requires ID');
      res.end();
      return undefined;
    }
    storage.delete('Food', req.url.query.id)
      .then((food) => {
        logger.log(logger.INFO, `FOOD-ROUTE: DEL ${food}`);
        res.writeHead(204, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(food));
        res.end();
        return undefined;
      })
      .catch((err) => {
        logger.log(logger.ERROR, `FOOD-ROUTE: Bad request ${err}`);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('DEL resource bad request');
        res.end();
        return undefined;
      });
    return undefined;
  });
};
