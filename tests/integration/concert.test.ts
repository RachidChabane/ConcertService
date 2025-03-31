import request from 'supertest';
import app from '../../src/app';
import setupTestDB from '../utils/setupTestDb';
import httpStatus from 'http-status';
import { concertService } from '../../src/services';
import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import mqConnection from '../../src/config/rabbitmq';
import { v4 as uuidv4 } from 'uuid';

setupTestDB();

jest.mock('../../src/config/rabbitmq', () => ({
  connect: jest.fn(),
  sendToQueue: jest.fn()
}));

beforeEach(() => {
  jest.clearAllMocks(); // Réinitialise tous les mocks avant chaque test
});

describe('Concerts API', () => {
    describe('GET /v1/concert/getConcerts', () => {
        test('should return 200 and all concerts', async () => {
            const res = await request(app)
                .get('/v1/concert/getConcerts')
                .expect(httpStatus.OK);

            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe('GET /v1/concert/getConcert', () => {
        test('should return 200 and the concert object if data is ok', async () => {
            const concert = await concertService.createConcert("Test Concert", "Test Location", new Date(), 100, "active");
            const res = await request(app)
                .get(`/v1/concert/getConcert/${concert.id}`)
                .expect(httpStatus.OK);

            expect(res.body).toHaveProperty('id', concert.id);
        });

        test('should return 404 error if concert is not found', async () => {
            const fakeId = uuidv4(); 

            await request(app)
                .get(`/v1/concert/getConcert/${fakeId}`)
                .expect(httpStatus.NOT_FOUND);
        });
    });

    describe('POST /v1/concert/createConcert', () => {
        test('should return 201 and successfully create new concert if data is ok', async () => {
            const newConcert = {
                title: "Test Concert",
                location: "Test Location",
                date: new Date().toISOString(),
                maxSeats: 100,
                status: "active"
            };

            const res = await request(app)
                .post('/v1/concert/createConcert')
                .send(newConcert)
                .expect(httpStatus.CREATED);

            expect(res.body).toHaveProperty('id');
            expect(res.body.title).toBe(newConcert.title);
        });

        test('should send a message to RabbitMQ when a concert is created', async () => {
            const newConcert = {
              title: 'Test Concert',
              location: 'Test Location',
              date: new Date().toISOString(),
              maxSeats: 100,
              status: 'active'
            };
      
            const res = await request(app)
              .post('/v1/concert/createConcert')
              .send(newConcert)
              .expect(httpStatus.CREATED);
      
            expect(mqConnection.sendToQueue).toHaveBeenCalledWith(
              'concert.created',
              expect.objectContaining({
                id: res.body.id,
                title: newConcert.title
              })
            );
          });
    });

    describe('DELETE /v1/concert/deleteConcert/:concertId', () => {
        test('should return 200 and successfully delete concert if data is ok', async () => {
            const concert = await concertService.createConcert("Test Concert", "Test Location", new Date(), 100, "active");

            await request(app)
                .delete(`/v1/concert/deleteConcert/${concert.id}`)
                .expect(httpStatus.OK);
        });

        test('should return 404 error if concert is not found', async () => {
            const fakeId = uuidv4();

            await request(app)
                .delete(`/v1/concert/deleteConcert/${fakeId}`)
                .expect(httpStatus.NOT_FOUND);
        });

        test('should send a message to RabbitMQ when a concert is deleted', async () => {
            const concert = await concertService.createConcert(
              'Test Concert',
              'Test Location',
              new Date(),
              100,
              'active'
            );
      
            await request(app)
              .delete(`/v1/concert/deleteConcert/${concert.id}`)
              .expect(httpStatus.OK);
      
            expect(mqConnection.sendToQueue).toHaveBeenCalledWith(
              'concert.deleted',
              expect.objectContaining({
                id: concert.id,
                deletedAt: expect.any(Date)
              })
            );
          });
    });

    describe('PUT /v1/concert/updateConcert/:concertId', () => {
        test('should return 200 and successfully update concert if data is ok', async () => {
            const concert = await concertService.createConcert("Test Concert", "Test Location", new Date(), 100, "active");

            const updatedConcert = {
                title: "Updated Concert",
                location: "Updated Location",
                date: new Date().toISOString(),
                maxSeats: 150,
                status: "inactive"
            };

            const res = await request(app)
                .put(`/v1/concert/updateConcert/${concert.id}`)
                .send(updatedConcert)
                .expect(httpStatus.OK);

            expect(res.body).toHaveProperty('id', concert.id);
            expect(res.body.title).toBe(updatedConcert.title);
        });

        test('should return 404 error if concert is not found', async () => {
            const fakeId = uuidv4();

            await request(app)
                .put(`/v1/concert/updateConcert/${fakeId}`)
                .expect(httpStatus.NOT_FOUND);
        });
    }
    );
});