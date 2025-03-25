import request from 'supertest';
import app from '../../src/app';
import setupTestDB from '../utils/setupTestDb';
import httpStatus from 'http-status';
import { concertService } from '../../src/services';
import { describe, expect, test } from '@jest/globals';
import { v4 as uuidv4 } from 'uuid'; 

setupTestDB();

describe('Concerts API', () => {
    describe('GET /v1/getConcerts', () => {
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
    });
});