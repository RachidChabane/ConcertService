import { Server } from 'http';
import app from './app';
import prisma from './client';
import config from './config/config';
import logger from './config/logger';
import mqConnection from './config/rabbitmq';

let server: Server;
prisma.$connect().then(async () => {
  await mqConnection.connect();
  logger.info('Connected to RabbitMQ');
  logger.info('Connected to SQL Database');
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});

const exitHandler = async () => {
  if (server) {
    server.close(async () => {
      logger.info('Server closed');
      await mqConnection.connect(); // Ensure RabbitMQ connection is closed
      process.exit(1);
    });
  } else {
    await mqConnection.connect();
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: unknown) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
