import prisma from '../../src/client';
import mqConnection from '../../src/config/rabbitmq';
import { beforeAll, beforeEach, afterAll } from '@jest/globals';

const setupTestDB = () => {
  beforeAll(async () => {
    await prisma.$connect();
    if (typeof mqConnection.connect === 'function') {
      await mqConnection.connect();
    }
  });

  beforeEach(async () => {
    await prisma.concert.deleteMany();
  });

  afterAll(async () => {
    await prisma.concert.deleteMany();
    await prisma.$disconnect();
    if (typeof mqConnection.connect === 'function') {
      await mqConnection.connect(); // Ensure RabbitMQ connection is closed
    }
  });
};

export default setupTestDB;
