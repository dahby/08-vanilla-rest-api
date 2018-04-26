'use strict';

const server = require('../lib/server');
const superagent = require('superagent');

const testPort = 5000;
const mockResource = { title: 'Steak', content: 'steak and eggs' };
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
          // console.log(res.body.title);
          // console.log(mockId);
          // console.log(mockResource.title);
        });
    });
  });
  describe('GET /api/v1/food?id=id', () => {
    test('should retrieve previous POST', () => {
      return superagent.get(`:${testPort}/api/v1/food?id=${mockId}`)
        .then((res) => {
          // console.log(mockId);
          // console.log(mockResource.title);
          // console.log(res.body.title);
          expect(res.body.title).toEqual(mockResource.title);
          expect(res.body.content).toEqual(mockResource.content);
          expect(res.status).toEqual(200);
        });
    });
  });
  describe('GET /api/v1/food', () => {
    test('should retrieve all food', () => {
      return superagent.get(`:${testPort}/api/v1/food`)
        .then((res) => {
          expect(res.body).toEqual([mockId]);
          expect(res.status).toEqual(200);
        });
    });
  });
});
