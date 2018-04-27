'use strict';

const server = require('../lib/server');
const superagent = require('superagent');

const testPort = 5000;
const mockResource = { title: 'Steak', content: 'steak and eggs' };
const mockFail = { title: '', content: '' };
let mockId = null;

beforeAll(() => server.start(testPort));
afterAll(() => server.stop());

describe('VALID request to the API', () => {
  describe('POST /api/v1/food', () => {
    test('should respond with a status 201 and create a new food', () => {
      return superagent.post(`:${testPort}/api/v1/food`)
        .send(mockResource)
        .then((res) => {
          mockId = res.body.id;
          expect(res.body.title).toEqual(mockResource.title);
          expect(res.body.content).toEqual(mockResource.content);
          expect(res.status).toEqual(201);
        });
    });
    test('failed post should respond with a 400', () => {
      return superagent.post(`:${testPort}/api/v1/food`)
        .send(mockFail)
        .then(() => {})
        .catch((err) => {
          expect(err).toBeTruthy();
          expect(err.status).toEqual(400);
        });
    });
  });
  describe('GET /api/v1/food?id=id', () => {
    test('should retrieve previous POST', () => {
      return superagent.get(`:${testPort}/api/v1/food?id=${mockId}`)
        .then((res) => {
          expect(res.body.title).toEqual(mockResource.title);
          expect(res.body.content).toEqual(mockResource.content);
          expect(res.status).toEqual(200);
        });
    });
    test('Bad id should result in 400', () => {
      return superagent.get((`:${testPort}/api/v1/food`))
        .then(() => {})
        .catch((err) => {
          expect(err).toBeTruthy();
          expect(err.status).toEqual(400);
        });
    });
    test('No id should result in 404', () => {
      return superagent.get(`:${testPort}/api/v1/ford`)
        .then(() => {})
        .catch((err) => {
          expect(err).toBeTruthy();
          expect(err.status).toEqual(404);
        }); 
    });
  });
});
