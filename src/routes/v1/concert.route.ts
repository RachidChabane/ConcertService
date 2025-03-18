import exp from 'constants';
import express from 'express';
import { concertController } from '../../controllers';

const router = express.Router();

router.route('/createConcert').post(concertController.createConcert);

router.route('/getConcerts').get(concertController.getConcerts);

router.route('/getConcert/:concertId').get(concertController.getConcert);

router.route('/deleteConcert/:concertId').delete(concertController.deleteConcert);

export default router;

/**
 * @swagger
 * tags:
 *   name: Concerts
 *   description: Concert management and retrieval
 */

/**
 * @swagger
 * /concerts:
 *   post:
 *     summary: Create a concert
 *     description: Create a new concert.
 *     tags: [Concerts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - location
 *               - date
 *               - maxSeats
 *               - status
 *             properties:
 *               title:
 *                 type: string
 *               location:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               maxSeats:
 *                 type: integer
 *               status:
 *                 type: string
 *             example:
 *               title: Rock Festival
 *               location: Paris
 *               date: "2025-06-15T20:00:00Z"
 *               maxSeats: 5000
 *               status: scheduled
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Concert'
 *       "400":
 *         description: Bad request
 *
 *   get:
 *     summary: Get all concerts
 *     description: Retrieve all concerts.
 *     tags: [Concerts]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Concert'
 */

/**
 * @swagger
 * /concerts/{id}:
 *   get:
 *     summary: Get a concert
 *     description: Retrieve a concert by ID.
 *     tags: [Concerts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Concert ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Concert'
 *       "404":
 *         description: Concert not found
 *
 *   delete:
 *     summary: Delete a concert
 *     description: Logically delete a concert by ID.
 *     tags: [Concerts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Concert ID
 *     responses:
 *       "200":
 *         description: No content
 *       "404":
 *         description: Concert not found
 */